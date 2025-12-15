
import { useState } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const CustomCalendar = ({ value, onChange, maxDate, minDate }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date(value || new Date()));
    const [direction, setDirection] = useState(0);

    const onNextMonth = () => {
        setDirection(1);
        setCurrentMonth(addMonths(currentMonth, 1));
    };

    const onPrevMonth = () => {
        setDirection(-1);
        setCurrentMonth(subMonths(currentMonth, 1));
    };

    const onDateClick = (day) => {
        if (maxDate && day > new Date(maxDate)) return;
        if (minDate && day < new Date(minDate)) return;
        onChange(day);
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-between items-center mb-4 px-2">
                <button type="button" onClick={onPrevMonth} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors text-gray-600 dark:text-gray-300">
                    <ChevronLeft size={20} />
                </button>
                <div className="text-base font-bold text-gray-800 dark:text-white">
                    {format(currentMonth, 'MMMM yyyy')}
                </div>
                <button type="button" onClick={onNextMonth} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors text-gray-600 dark:text-gray-300">
                    <ChevronRight size={20} />
                </button>
            </div>
        );
    };

    const renderDays = () => {
        const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
        return (
            <div className="grid grid-cols-7 mb-2">
                {days.map(day => (
                    <div key={day} className="text-center text-xs font-semibold text-gray-400 dark:text-slate-500 py-1">
                        {day}
                    </div>
                ))}
            </div>
        );
    };

    const renderCells = () => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);

        const dateFormat = "d";
        const rows = [];
        let days = [];
        let day = startDate;
        let formattedDate = "";

        // Generate all days to cover the 6-week grid
        const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

        return (
            <motion.div
                key={currentMonth.toString()}
                initial={{ x: direction * 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -direction * 50, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-7 gap-1"
            >
                {calendarDays.map((dayItem, i) => {
                    formattedDate = format(dayItem, dateFormat);
                    const cloneDay = dayItem;

                    const isDisabled = (maxDate && dayItem > new Date(maxDate)) || (minDate && dayItem < new Date(minDate));
                    const isSelected = value ? isSameDay(dayItem, new Date(value)) : false;
                    const isCurrentMonth = isSameMonth(dayItem, monthStart);

                    return (
                        <div
                            key={dayItem.toString()}
                            className={cn(
                                "relative w-8 h-8 flex items-center justify-center text-sm font-medium rounded-full cursor-pointer transition-all mx-auto",
                                !isCurrentMonth ? "text-gray-300 dark:text-slate-700" : (isDisabled ? "text-gray-300 dark:text-slate-600 cursor-not-allowed" : "text-gray-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-slate-800"),
                                isSelected ? "bg-indigo-600 text-white shadow-md shadow-indigo-300 dark:shadow-indigo-900 !text-white" : "",
                                isToday(dayItem) && !isSelected ? "ring-1 ring-indigo-500 text-indigo-600 dark:text-indigo-400" : ""
                            )}
                            onClick={() => !isDisabled && onDateClick(cloneDay)}
                        >
                            {formattedDate}
                        </div>
                    );
                })}
            </motion.div>
        );
    };

    return (
        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl shadow-xl p-4 w-[300px]">
            {renderHeader()}
            {renderDays()}
            <AnimatePresence mode='popLayout' custom={direction}>
                {renderCells()}
            </AnimatePresence>
        </div>
    );
};

export default CustomCalendar;
