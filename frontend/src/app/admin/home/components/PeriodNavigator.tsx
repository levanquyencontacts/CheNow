"use client";

import { Box } from "@/components";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import DatePicker from "react-datepicker";

type Range = "week" | "month" | "year";

interface PeriodNavigatorProps {
  anchorDate: Date;
  onChange: (date: Date) => void;
  range: Range;
}

function startOfWeekMonday(date: Date): Date {
  const nextDate = new Date(date);
  nextDate.setHours(0, 0, 0, 0);
  const day = nextDate.getDay();
  const offset = day === 0 ? -6 : 1 - day;
  nextDate.setDate(nextDate.getDate() + offset);
  return nextDate;
}

function endOfWeekMonday(date: Date): Date {
  const endDate = startOfWeekMonday(date);
  endDate.setDate(endDate.getDate() + 6);
  return endDate;
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function startOfYear(date: Date): Date {
  return new Date(date.getFullYear(), 0, 1);
}

function toDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function isSameWeek(a: Date, b: Date): boolean {
  return (
    toDateString(startOfWeekMonday(a)) === toDateString(startOfWeekMonday(b))
  );
}

function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

function isSameYear(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear();
}

function getPeriodLabel(range: Range, anchor: Date): string {
  const weekdays = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
  const today = new Date();

  if (range === "week") {
    const start = startOfWeekMonday(anchor);
    const end = endOfWeekMonday(anchor);
    const fmt = (date: Date) => `${date.getDate()}/${date.getMonth() + 1}`;

    if (isSameWeek(anchor, today)) {
      return "Tuần này";
    }

    return `${weekdays[start.getDay()]} ${fmt(start)} - ${
      weekdays[end.getDay()]
    } ${fmt(end)}`;
  }

  if (range === "month") {
    if (isSameMonth(anchor, today)) {
      return "Tháng này";
    }

    return `Tháng ${anchor.getMonth() + 1}, ${anchor.getFullYear()}`;
  }

  if (isSameYear(anchor, today)) {
    return "Năm nay";
  }

  return `Năm ${anchor.getFullYear()}`;
}

function navigate(range: Range, anchor: Date, direction: -1 | 1): Date {
  const nextDate = new Date(anchor);

  if (range === "week") {
    nextDate.setDate(nextDate.getDate() + direction * 7);
    return nextDate;
  }

  if (range === "month") {
    nextDate.setMonth(nextDate.getMonth() + direction);
    return startOfMonth(nextDate);
  }

  nextDate.setFullYear(nextDate.getFullYear() + direction);
  return startOfYear(nextDate);
}

function isAtPresent(range: Range, anchor: Date): boolean {
  const today = new Date();

  if (range === "week") {
    return isSameWeek(anchor, today);
  }

  if (range === "month") {
    return isSameMonth(anchor, today);
  }

  return isSameYear(anchor, today);
}

export function PeriodNavigator({
  anchorDate,
  onChange,
  range,
}: PeriodNavigatorProps) {
  const atPresent = isAtPresent(range, anchorDate);
  const label = getPeriodLabel(range, anchorDate);
  const weekStart = startOfWeekMonday(anchorDate);
  const weekEnd = endOfWeekMonday(anchorDate);
  const today = new Date();

  function handlePrev() {
    onChange(navigate(range, anchorDate, -1));
  }

  function handleNext() {
    if (!atPresent) {
      onChange(navigate(range, anchorDate, 1));
    }
  }

  function handleDateChange(date: Date | null) {
    if (!date) {
      return;
    }

    if (range === "month") {
      onChange(startOfMonth(date));
      return;
    }

    if (range === "year") {
      onChange(startOfYear(date));
      return;
    }

    onChange(date);
  }

  return (
    <Box className="flex items-center gap-1">
      <button
        aria-label="Kỳ trước"
        className="flex h-7 w-7 items-center justify-center rounded-full text-[#7c7067] transition hover:bg-[#f5ede4] hover:text-[#432010]"
        onClick={handlePrev}
        type="button"
      >
        <ChevronLeft aria-hidden="true" className="h-4 w-4" />
      </button>

      <DatePicker
        calendarClassName="chenow-datepicker"
        dateFormat={getDateFormat(range)}
        maxDate={today}
        onChange={handleDateChange}
        popperClassName="z-[80]"
        renderCustomHeader={({
          date,
          decreaseMonth,
          decreaseYear,
          increaseMonth,
          increaseYear,
          prevMonthButtonDisabled,
          prevYearButtonDisabled,
          nextMonthButtonDisabled,
          nextYearButtonDisabled,
        }) => (
          <DatePickerHeader
            canGoNext={
              range === "week" ? !nextMonthButtonDisabled : !nextYearButtonDisabled
            }
            canGoPrev={
              range === "week" ? !prevMonthButtonDisabled : !prevYearButtonDisabled
            }
            label={getHeaderLabel(range, date)}
            onNext={range === "week" ? increaseMonth : increaseYear}
            onPrev={range === "week" ? decreaseMonth : decreaseYear}
          />
        )}
        selected={anchorDate}
        selectsEnd={false}
        showMonthYearPicker={range === "month"}
        showYearPicker={range === "year"}
        startDate={range === "week" ? weekStart : undefined}
        endDate={range === "week" ? weekEnd : undefined}
        customInput={<PeriodPickerButton label={label} />}
      />

      <button
        aria-label="Kỳ sau"
        className={[
          "flex h-7 w-7 items-center justify-center rounded-full transition",
          atPresent
            ? "cursor-not-allowed text-[#c9b9ac]"
            : "text-[#7c7067] hover:bg-[#f5ede4] hover:text-[#432010]",
        ].join(" ")}
        disabled={atPresent}
        onClick={handleNext}
        type="button"
      >
        <ChevronRight aria-hidden="true" className="h-4 w-4" />
      </button>
    </Box>
  );
}

function PeriodPickerButton({
  label,
  onClick,
}: {
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      aria-label="Chọn kỳ thống kê"
      className="inline-flex min-h-7 min-w-[128px] items-center justify-center gap-1.5 rounded px-2 text-center text-[11px] font-bold text-[#432010] transition hover:bg-[#f5ede4]"
      onClick={onClick}
      type="button"
    >
      <CalendarDays aria-hidden="true" className="h-3.5 w-3.5" />
      <span>{label}</span>
    </button>
  );
}

function DatePickerHeader({
  canGoNext,
  canGoPrev,
  label,
  onNext,
  onPrev,
}: {
  canGoNext: boolean;
  canGoPrev: boolean;
  label: string;
  onNext: () => void;
  onPrev: () => void;
}) {
  return (
    <Box className="mb-2 flex items-center justify-between px-2 pt-2">
      <button
        aria-label="Lùi lại"
        className={[
          "flex h-7 w-7 items-center justify-center rounded-full transition",
          canGoPrev
            ? "text-[#7c7067] hover:bg-[#f5ede4] hover:text-[#432010]"
            : "cursor-not-allowed text-[#c9b9ac]",
        ].join(" ")}
        disabled={!canGoPrev}
        onClick={onPrev}
        type="button"
      >
        <ChevronLeft aria-hidden="true" className="h-4 w-4" />
      </button>

      <p className="text-xs font-extrabold text-[#432010]">{label}</p>

      <button
        aria-label="Tiến tới"
        className={[
          "flex h-7 w-7 items-center justify-center rounded-full transition",
          canGoNext
            ? "text-[#7c7067] hover:bg-[#f5ede4] hover:text-[#432010]"
            : "cursor-not-allowed text-[#c9b9ac]",
        ].join(" ")}
        disabled={!canGoNext}
        onClick={onNext}
        type="button"
      >
        <ChevronRight aria-hidden="true" className="h-4 w-4" />
      </button>
    </Box>
  );
}

function getDateFormat(range: Range) {
  if (range === "month") {
    return "MM/yyyy";
  }

  if (range === "year") {
    return "yyyy";
  }

  return "dd/MM/yyyy";
}

function getHeaderLabel(range: Range, date: Date) {
  if (range === "year") {
    return "Chọn năm";
  }

  if (range === "month") {
    return `Năm ${date.getFullYear()}`;
  }

  return `Tháng ${date.getMonth() + 1}, ${date.getFullYear()}`;
}

export { toDateString };
