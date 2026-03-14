"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import type { SampleFormOption } from "@/lib/samples";

type SampleCreateFormValues = {
  sampleName: string;
  sampleType: string;
  clientId: string;
  testType: string;
  assignedScientistId: string;
};

type SampleCreateFormProps = {
  clients: SampleFormOption[];
  scientists: SampleFormOption[];
};

export function SampleCreateForm({ clients, scientists }: SampleCreateFormProps) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<SampleCreateFormValues>({
    defaultValues: {
      sampleName: "",
      sampleType: "",
      clientId: "",
      testType: "",
      assignedScientistId: ""
    }
  });

  async function onSubmit(values: SampleCreateFormValues) {
    setFormError(null);

    const response = await fetch("/api/samples", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        sampleName: values.sampleName,
        sampleType: values.sampleType,
        clientId: values.clientId,
        testType: values.testType,
        assignedScientistId: values.assignedScientistId || null
      })
    });

    const payload = await response.json();

    if (!response.ok) {
      setFormError(payload.error ?? "The sample could not be created.");
      return;
    }

    // Use replace so the user lands on the created sample instead of keeping the form in history.
    router.replace(`/samples/${payload.data.id}`);
    router.refresh();
  }

  return (
    <Card className="border-white/70 bg-white/85">
      <CardHeader>
        <CardTitle>Create Sample</CardTitle>
        <CardDescription>
          This form is used by the lab manager to register a new sample record.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-5 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <Label htmlFor="sampleName">Sample Name</Label>
            <Input
              id="sampleName"
              placeholder="Serum Sample A"
              {...register("sampleName", { required: "Sample name is required." })}
            />
            {errors.sampleName ? (
              <p className="text-sm text-rose-600">{errors.sampleName.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="sampleType">Sample Type</Label>
            <Input
              id="sampleType"
              placeholder="Blood"
              {...register("sampleType", { required: "Sample type is required." })}
            />
            {errors.sampleType ? (
              <p className="text-sm text-rose-600">{errors.sampleType.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientId">Client</Label>
            <Select
              id="clientId"
              {...register("clientId", { required: "Client selection is required." })}
            >
              <option value="">Select client</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.full_name}
                </option>
              ))}
            </Select>
            {errors.clientId ? (
              <p className="text-sm text-rose-600">{errors.clientId.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="testType">Test Type</Label>
            <Input
              id="testType"
              placeholder="CBC"
              {...register("testType", { required: "Test type is required." })}
            />
            {errors.testType ? (
              <p className="text-sm text-rose-600">{errors.testType.message}</p>
            ) : null}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="assignedScientistId">Assigned Scientist</Label>
            <Select id="assignedScientistId" {...register("assignedScientistId")}>
              <option value="">Assign later</option>
              {scientists.map((scientist) => (
                <option key={scientist.id} value={scientist.id}>
                  {scientist.full_name}
                </option>
              ))}
            </Select>
            <p className="text-sm text-[#6b8f92]">
              This optional assignment is what lets the scientist see the sample in their own list.
            </p>
          </div>

          {formError ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 md:col-span-2">
              {formError}
            </div>
          ) : null}

          <div className="md:col-span-2">
            <Button type="submit" size="lg" disabled={isSubmitting}>
              {isSubmitting ? "Creating sample..." : "Create Sample"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
