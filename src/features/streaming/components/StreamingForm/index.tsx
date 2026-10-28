import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardTitle } from '@/components/ui/Card';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { NativeSelect, NativeSelectOption } from '@/components/ui/NativeSelect';
import { Textarea } from '@/components/ui/Textarea';
import { DevTool } from '@hookform/devtools';
import { zodResolver } from '@hookform/resolvers/zod';
import { SendIcon } from 'lucide-react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import type { z } from 'zod/v4';
import { streamingFormInputSchema } from '../../schemas';

const contentTypesLabelMap = {
  'text/plain': 'Text (text/plain)',
  'multipart/form-data': 'File (multipart/form-data)',
} satisfies Record<z.infer<typeof streamingFormInputSchema>['type'], string>;

export const StreamingForm = () => {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      type: 'text/plain',
      content: '',
    },
    resolver: zodResolver(streamingFormInputSchema),
  });

  const submitHandler = handleSubmit((data) => {
    console.log('🚀 ~ StreamingForm ~ data:', data);
  });

  const type = useWatch({ control, name: 'type' });

  return (
    <>
      <Card>
        <CardTitle>Send Content</CardTitle>
        <CardContent>
          <form onSubmit={submitHandler}>
            <FieldGroup className="mt-4">
              <Controller
                control={control}
                name="type"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="type-select">Content type</FieldLabel>
                    <NativeSelect
                      id="type-select"
                      aria-invalid={fieldState.invalid}
                      {...field}
                    >
                      {Object.entries(contentTypesLabelMap).map(
                        ([type, label]) => (
                          <NativeSelectOption value={type} key={type}>
                            {label}
                          </NativeSelectOption>
                        ),
                      )}
                    </NativeSelect>
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                )}
              />

              {type === 'text/plain' && (
                <Controller
                  shouldUnregister
                  control={control}
                  name="content"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="content-input">Content</FieldLabel>
                      <Textarea
                        id="content-input"
                        placeholder="Enter your content"
                        {...field}
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.error && (
                        <FieldError>{fieldState.error.message}</FieldError>
                      )}
                    </Field>
                  )}
                />
              )}
              {type === 'multipart/form-data' && (
                <Controller
                  shouldUnregister
                  control={control}
                  name="file"
                  render={({ field, fieldState }) => {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const { value, onChange, ...restField } = field;
                    return (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="file-input">File</FieldLabel>
                        <Input
                          onChange={(e) => {
                            const file = e.currentTarget.files?.item(0);
                            if (!file) return;

                            onChange(file);
                          }}
                          id="file-input"
                          placeholder="Choose your file"
                          type="file"
                          {...restField}
                          aria-invalid={fieldState.invalid}
                        />
                        {fieldState.error && (
                          <FieldError>{fieldState.error.message}</FieldError>
                        )}
                      </Field>
                    );
                  }}
                />
              )}
            </FieldGroup>

            <Button size="xl" className="mt-4" type="submit">
              <SendIcon />
              Send
            </Button>
          </form>
        </CardContent>
      </Card>

      <DevTool control={control} />
    </>
  );
};
