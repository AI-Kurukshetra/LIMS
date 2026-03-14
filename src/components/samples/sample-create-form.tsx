"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import {
  getSamplePriorityLabel,
  samplePriorities,
  type SampleFormOption,
  type SamplePriority
} from "@/lib/samples";

type SampleCreateFormValues = {
  sampleName: string;
  sampleType: string;
  clientId: string;
  testType: string;
  priority: SamplePriority;
  receivedAt: string;
  barcodeValue: string;
  sourceLabel: string;
  currentLocation: string;
  assignedScientistId: string;
};

type SampleCreateFormProps = {
  clients: SampleFormOption[];
  scientists: SampleFormOption[];
};

function getDefaultReceivedAtValue() {
  const now = new Date();
  const timezoneOffset = now.getTimezoneOffset() * 60_000;

  return new Date(now.getTime() - timezoneOffset).toISOString().slice(0, 16);
}

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
      priority: "routine",
      receivedAt: getDefaultReceivedAtValue(),
      barcodeValue: "",
      sourceLabel: "",
      currentLocation: "",
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
        priority: values.priority,
        receivedAt: new Date(values.receivedAt).toISOString(),
        barcodeValue: values.barcodeValue || null,
        sourceLabel: values.sourceLabel || null,
        currentLocation: values.currentLocation || null,
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
          This form is used by the lab manager to register a new sample and start its tracking history.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-5 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <Label htmlFor="receivedAt">Received Date And Time</Label>
            <Input
              id="receivedAt"
              type="datetime-local"
              {...register("receivedAt", { required: "Received date and time is required." })}
            />
            {errors.receivedAt ? (
              <p className="text-sm text-rose-600">{errors.receivedAt.message}</p>
            ) : null}
          </div>

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
            <Label htmlFor="sourceLabel">Sample Source</Label>
            <Input
              id="sourceLabel"
              placeholder="Ward A / External Clinic"
              {...register("sourceLabel")}
            />
            <p className="text-sm text-[#6b8f92]">
              Use plain words so non-technical staff can identify where the sample came from.
            </p>
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
            <Label htmlFor="priority">Priority</Label>
            <Select
              id="priority"
              {...register("priority", { required: "Priority is required." })}
            >
              {samplePriorities.map((priority) => (
                <option key={priority} value={priority}>
                  {getSamplePriorityLabel(priority)}
                </option>
              ))}
            </Select>
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

          <div className="space-y-2">
            <Label htmlFor="barcodeValue">Barcode Value</Label>
            <Input
              id="barcodeValue"
              placeholder="BC-20260314-001"
              {...register("barcodeValue")}
            />
            <p className="text-sm text-[#6b8f92]">
              Optional for now. You can enter a printed barcode number manually.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="currentLocation">Current Location</Label>
            <Input
              id="currentLocation"
              placeholder="Sample Reception / Rack A1"
              {...register("currentLocation")}
            />
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
