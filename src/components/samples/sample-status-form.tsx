"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import {
  getSampleStatusLabel,
  sampleStatuses,
  type SampleFormOption,
  type SampleStatus
} from "@/lib/samples";

type SampleStatusFormValues = {
  status: SampleStatus;
  assignedScientistId: string;
};

type SampleStatusFormProps = {
  sampleId: string;
  currentStatus: SampleStatus;
  currentScientistId: string | null;
  scientists: SampleFormOption[];
};

export function SampleStatusForm({
  sampleId,
  currentStatus,
  currentScientistId,
  scientists
}: SampleStatusFormProps) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm<SampleStatusFormValues>({
    defaultValues: {
      status: currentStatus,
      assignedScientistId: currentScientistId ?? ""
    }
  });

  async function onSubmit(values: SampleStatusFormValues) {
    setFormError(null);

    const response = await fetch(`/api/samples/${sampleId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        status: values.status,
        assignedScientistId: values.assignedScientistId || null
      })
    });

    const payload = await response.json();

    if (!response.ok) {
      setFormError(payload.error ?? "The sample update failed.");
      return;
    }

    router.refresh();
  }

  return (
    <Card className="border-white/70 bg-white/85">
      <CardHeader>
        <CardTitle>Status Update</CardTitle>
        <CardDescription>
          Only the lab manager can move the sample forward or change scientist assignment.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <Label htmlFor="status">Current Workflow Status</Label>
            <Select id="status" {...register("status")}>
              {sampleStatuses.map((status) => (
                <option key={status} value={status}>
                  {getSampleStatusLabel(status)}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="assignedScientistId">Assigned Scientist</Label>
            <Select id="assignedScientistId" {...register("assignedScientistId")}>
              <option value="">Assign later</option>
              {scientists.map((scientist) => (
                <option key={scientist.id} value={scientist.id}>
                  {scientist.full_name}
                </option>
              ))}
            </Select>
          </div>

          {formError ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
              {formError}
            </div>
          ) : null}

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Update Sample"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
