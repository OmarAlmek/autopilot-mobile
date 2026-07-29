param(
    [Parameter(Mandatory = $true)]
    [string]$Url,

    [Parameter(Mandatory = $true)]
    [string]$OutputPath,

    [Parameter(Mandatory = $true)]
    [string]$WaitForText,

    [string]$ScrollToText,

    [int]$Port = 9223
)

$ErrorActionPreference = 'Stop'
$target = Invoke-RestMethod -Method Put -Uri "http://127.0.0.1:$Port/json/new?about:blank"
$socket = [System.Net.WebSockets.ClientWebSocket]::new()
$socket.ConnectAsync([Uri]$target.webSocketDebuggerUrl, [Threading.CancellationToken]::None).GetAwaiter().GetResult()
$nextId = 0

function Receive-DevToolsMessage {
    $stream = [IO.MemoryStream]::new()
    do {
        $buffer = New-Object byte[] 65536
        $segment = [ArraySegment[byte]]::new($buffer)
        $result = $socket.ReceiveAsync($segment, [Threading.CancellationToken]::None).GetAwaiter().GetResult()
        $stream.Write($buffer, 0, $result.Count)
    } while (-not $result.EndOfMessage)

    $message = [Text.Encoding]::UTF8.GetString($stream.ToArray())
    $stream.Dispose()
    return $message | ConvertFrom-Json
}

function Invoke-DevToolsCommand {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Method,

        [hashtable]$Params = @{}
    )

    $script:nextId += 1
    $id = $script:nextId
    $payload = @{ id = $id; method = $Method; params = $Params } | ConvertTo-Json -Depth 10 -Compress
    $bytes = [Text.Encoding]::UTF8.GetBytes($payload)
    $segment = [ArraySegment[byte]]::new($bytes)
    $socket.SendAsync($segment, [Net.WebSockets.WebSocketMessageType]::Text, $true, [Threading.CancellationToken]::None).GetAwaiter().GetResult()

    do {
        $response = Receive-DevToolsMessage
    } while ($response.id -ne $id)

    if ($response.error) {
        throw "$Method failed: $($response.error.message)"
    }

    return $response.result
}

try {
    Invoke-DevToolsCommand -Method 'Page.enable' | Out-Null
    Invoke-DevToolsCommand -Method 'Emulation.setDeviceMetricsOverride' -Params @{
        width = 390
        height = 844
        deviceScaleFactor = 3
        mobile = $true
        screenWidth = 390
        screenHeight = 844
        screenOrientation = @{ type = 'portraitPrimary'; angle = 0 }
    } | Out-Null
    Invoke-DevToolsCommand -Method 'Emulation.setTouchEmulationEnabled' -Params @{
        enabled = $true
        maxTouchPoints = 5
    } | Out-Null
    Invoke-DevToolsCommand -Method 'Emulation.setUserAgentOverride' -Params @{
        userAgent = 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Mobile Safari/537.36'
        platform = 'Android'
    } | Out-Null
    Invoke-DevToolsCommand -Method 'Page.navigate' -Params @{ url = $Url } | Out-Null

    $waitTextJson = $WaitForText | ConvertTo-Json -Compress
    $ready = $false
    $attempts = 0
    while (-not $ready -and $attempts -lt 150) {
        $state = Invoke-DevToolsCommand -Method 'Runtime.evaluate' -Params @{
            expression = "document.readyState === 'complete' && document.body?.innerText.includes($waitTextJson)"
            returnByValue = $true
        }
        $ready = $state.result.value -eq $true
        $attempts += 1
        if (-not $ready) {
            [Threading.Tasks.Task]::Delay(100).GetAwaiter().GetResult()
        }
    }
    if (-not $ready) {
        throw "Timed out waiting for: $WaitForText"
    }

        if ($ScrollToText) {
                $scrollTextJson = $ScrollToText | ConvertTo-Json -Compress
                Invoke-DevToolsCommand -Method 'Runtime.evaluate' -Params @{
                        expression = @"
(() => {
    const expected = $scrollTextJson;
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
        if (walker.currentNode.textContent?.includes(expected)) {
            walker.currentNode.parentElement?.scrollIntoView({ block: 'start' });
            return true;
        }
    }
    throw new Error(`Unable to scroll to: `${expected});
})()
"@
                        returnByValue = $true
                } | Out-Null
        }

    $metrics = Invoke-DevToolsCommand -Method 'Runtime.evaluate' -Params @{
        expression = 'JSON.stringify({width: innerWidth, height: innerHeight, dpr: devicePixelRatio, touch: navigator.maxTouchPoints, coarse: matchMedia("(pointer: coarse)").matches, overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth})'
        returnByValue = $true
    }
    $screenshot = Invoke-DevToolsCommand -Method 'Page.captureScreenshot' -Params @{
        format = 'png'
        fromSurface = $true
        captureBeyondViewport = $false
    }

    $directory = Split-Path -Parent $OutputPath
    if (-not (Test-Path $directory)) {
        New-Item -ItemType Directory -Path $directory | Out-Null
    }
    [IO.File]::WriteAllBytes($OutputPath, [Convert]::FromBase64String($screenshot.data))
    $metrics.result.value | ConvertFrom-Json
} finally {
    if ($socket.State -eq [Net.WebSockets.WebSocketState]::Open) {
        $socket.CloseAsync([Net.WebSockets.WebSocketCloseStatus]::NormalClosure, 'done', [Threading.CancellationToken]::None).GetAwaiter().GetResult()
    }
    $socket.Dispose()
}