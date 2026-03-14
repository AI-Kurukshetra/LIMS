import type { ReactNode } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type DataTableProps = {
  title: string;
  description: string;
  columns: string[];
  rows: ReactNode[][];
};

export function DataTable({ title, description, columns, rows }: DataTableProps) {
  return (
    <Card className="border-white/70 bg-white/85">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto rounded-2xl border border-border/70">
          <table className="min-w-full border-collapse text-left text-sm">
            <thead className="bg-[#f3fbf9] text-[#4f7a7f]">
              <tr>
                {columns.map((column) => (
                  <th key={column} className="px-4 py-3 font-semibold">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white">
              {rows.map((row, rowIndex) => (
                <tr key={`row-${rowIndex}`} className="border-t border-border/70">
                  {row.map((cell, cellIndex) => (
                    <td key={`cell-${rowIndex}-${cellIndex}`} className="px-4 py-3 text-[#12343b]">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
