import { useRouter } from 'expo-router';
import { useState } from 'react';

import { VentureModuleScreen } from '../../../src/components/ventureOS/VentureModuleScreen';
import { useVentureOS } from '../../../src/context/VentureOSContext';
import { CompanyContextWorkflow } from '../../../src/features/ventureOS/context/CompanyContextWorkflow';

export default function ContextScreen() {
  const router = useRouter();
  const {
    companyContext,
    companyContextResource,
    reloadCompanyContext,
    setCompanyContext,
  } = useVentureOS();
  const [isEditing, setIsEditing] = useState(false);
  const fields = Object.values(companyContext);
  const completedFields = fields.filter((value) => value.trim().length > 0).length;
  const completion = Math.round((completedFields / fields.length) * 100);

  if (companyContextResource.status === 'ready' && (isEditing || completedFields === 0)) {
    return (
      <CompanyContextWorkflow
        initialValue={companyContext}
        onCancel={() => completedFields === 0
          ? router.replace('/venture-os/curriculum')
          : setIsEditing(false)}
        onSave={async (value) => {
          await setCompanyContext(value);
          setIsEditing(false);
        }}
      />
    );
  }

  return (
    <VentureModuleScreen
      eyebrow="Personalization"
      title="Teach Venture OS your business"
      description="Set your company context once so lessons, examples, risk maps, and guidance adapt to your goals."
      icon="domain"
      stats={[{ value: String(fields.length), label: 'Context fields' }, { value: completedFields > 0 ? '1' : '0', label: 'Company profile' }, { value: `${completion}%`, label: 'Complete' }]}
      nextTitle="Edit company context"
      nextDescription="Review the details Venture OS uses to personalize guidance"
      onNextPress={() => setIsEditing(true)}
      status={companyContextResource.status === 'loading'
        ? { kind: 'loading' }
        : companyContextResource.status === 'error'
          ? { kind: 'error', message: companyContextResource.error.message, onRetry: reloadCompanyContext }
          : undefined}
    />
  );
}