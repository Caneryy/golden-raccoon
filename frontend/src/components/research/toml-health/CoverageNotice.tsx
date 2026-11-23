"use client";

type CoverageNoticeProps = {
  notice: string;
};

export function CoverageNotice({ notice }: CoverageNoticeProps) {
  return (
    <div className="rounded-md border border-amber-200 bg-amber-50 p-4">
      <p className="text-sm text-amber-900">{notice}</p>
    </div>
  );
}
