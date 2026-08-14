"use client";
import { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";

export interface ScheduleItem {
  title: string;
  description: string;
}

interface Props {
  value: ScheduleItem[];
  onChange: (value: ScheduleItem[]) => void;
}

export default function ScheduleEditor({ value, onChange }: Props) {
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState<Record<number, boolean>>({});

  const update = (i: number, patch: Partial<ScheduleItem>) => {
    onChange(value.map((item, idx) => (idx === i ? { ...item, ...patch } : item)));
  };

  const remove = (i: number) => {
    onChange(value.filter((_, idx) => idx !== i));
  };

  const add = () => {
    onChange([...value, { title: "", description: "" }]);
  };

  const toggleCollapsed = (i: number) => {
    setCollapsed((prev) => ({ ...prev, [i]: !prev[i] }));
  };

  return (
    <div className="inner-group inner-two-col">
      <label className="inner-label">{t.tourDetail.tourSchedule}</label>
      <div className="inner-schedule">
        <div className="inner-schedule-list">
          {value.map((item, i) => (
            <div className={`inner-schedule-item${collapsed[i] ? " hidden" : ""}`} key={i}>
              <div className="inner-schedule-head">
                <input
                  type="text"
                  value={item.title}
                  placeholder={t.scheduleEditor.dayTitlePlaceholder}
                  onChange={(e) => update(i, { title: e.target.value })}
                />
                <div className="inner-schedule-button inner-remove" onClick={() => remove(i)}>
                  <i className="fa-solid fa-trash-can"></i>
                </div>
                <div className="inner-schedule-button inner-more" onClick={() => toggleCollapsed(i)}>
                  <i className="fa-solid fa-angle-down"></i>
                </div>
              </div>
              <div className="inner-schedule-body">
                <textarea
                  value={item.description}
                  placeholder={t.scheduleEditor.dayDescriptionPlaceholder}
                  onChange={(e) => update(i, { description: e.target.value })}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="inner-schedule-create" onClick={add}>{t.scheduleEditor.addSchedule}</div>
      </div>
    </div>
  );
}
