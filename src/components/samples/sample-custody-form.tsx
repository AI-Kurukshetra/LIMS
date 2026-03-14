"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  getSampleCustodyEventLabel,
  sampleCustodyEventTypes,
  type SampleCustodyEventType,
  type SampleFormOption
} from "@/lib/samples";

type SampleCustodyFormValues = {
  eventType: SampleCustodyEventType;
  toProfileId: string;
  location: string;
  notes: string;
};

type SampleCustodyFormProps = {
  sampleId: string;
  staff: SampleFormOption[];
  currentLocation: string | null;
};

export function SampleCustodyForm({
  sampleId,
  staff,
  currentLocation
}: SampleCustodyFormProps) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting }
  } = useForm<SampleCustodyFormValues>({
    defaultValues: {
      eventType: "handoff",
      toProfileId: "",
      location: currentLocation ?? "",
      notes: ""
    }
  });
  const eventType = watch("eventType");

  async function onSubmit(values: SampleCustodyFormValues) {
    setFormError(null);

    const response = await fetch(`/api/samples/${sampleId}/custody`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        eventType: values.eventType,
        toProfileId: values.toProfileId || null,
        location: values.location || null,
        notes: values.notes || null
      })
    });

    const payload = await response.json();

    if (!response.ok) {
      setFormError(payload.error ?? "The custody update failed.");
      return;
    }

    router.refresh();
  }

  return (
    <Card className="border-white/70 bg-white/85">
      <CardHeader>
        <CardTitle>Log Sample Movement</CardTitle>
        <CardDescription>
          Record who received the sample, who it was handed to, or where it was stored.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <Label htmlFor="eventType">Movement Type</Label>
            <Select id="eventType" {...register("eventType")}>
              {sampleCustodyEventTypes.map((item) => (
                <option key={item} value={item}>
                  {getSampleCustodyEventLabel(item)}
                </option>
              ))}
            </Select>
          </div>

          {eventType === "handoff" ? (
            <div className="space-y-2">
              <Label htmlFor="toProfileId">Handed To</Label>
              <Select id="toProfileId" {...register("toProfileId")}>
                <option value="">Select staff member</option>
                {staff.map((person) => (
                  <option key={person.id} value={person.id}>
                    {person.full_name}
                  </option>
                ))}
              </Select>
            </div>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="Sample Reception / Bench 4 / Freezer Shelf B"
              {...register("location")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Optional note that explains the movement in simple words."
              {...register("notes")}
            />
          </div>

          {formError ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
              {formError}
            </div>
          ) : null}

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Movement"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
