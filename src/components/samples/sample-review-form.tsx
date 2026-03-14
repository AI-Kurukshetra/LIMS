"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  getSampleReviewStatusLabel,
  sampleReviewStatuses,
  type SampleReviewStatus
} from "@/lib/samples";

type SampleReviewFormValues = {
  reviewStatus: SampleReviewStatus;
  feedback: string;
};

type SampleReviewFormProps = {
  sampleId: string;
};

export function SampleReviewForm({ sampleId }: SampleReviewFormProps) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm<SampleReviewFormValues>({
    defaultValues: {
      reviewStatus: "reviewed",
      feedback: ""
    }
  });

  async function onSubmit(values: SampleReviewFormValues) {
    setFormError(null);

    if (!values.feedback.trim()) {
      setFormError("Please enter review feedback before saving.");
      return;
    }

    const response = await fetch(`/api/samples/${sampleId}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(values)
    });

    const payload = await response.json();

    if (!response.ok) {
      setFormError(payload.error ?? "The review could not be saved.");
      return;
    }

    router.refresh();
  }

  return (
    <Card className="border-white/70 bg-white/85">
      <CardHeader>
        <CardTitle>Scientist Review</CardTitle>
        <CardDescription>
          Add your review decision and feedback for the assigned sample.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <Label htmlFor="reviewStatus">Review Status</Label>
            <Select id="reviewStatus" {...register("reviewStatus")}>
              {sampleReviewStatuses.map((status) => (
                <option key={status} value={status}>
                  {getSampleReviewStatusLabel(status)}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="feedback">Feedback</Label>
            <Textarea
              id="feedback"
              placeholder="Write your scientific review, findings, or recommendation in simple words."
              {...register("feedback")}
            />
          </div>

          {formError ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
              {formError}
            </div>
          ) : null}

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving Review..." : "Save Review"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
