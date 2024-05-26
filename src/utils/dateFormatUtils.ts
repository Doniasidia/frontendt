import { DateTime, Duration } from "luxon";

/**
 * Utility class for date formatting and comparison using Luxon.
 */
class DateFormat {
    static readonly SimpleDateFormat = "dd/MM/yyyy";
    static readonly SimpleDurationFormat = "h'h':m";
    static readonly MonthYearFormat = "MMM yyyy";


    static getFormattedDate = (dateStr: string, locale: string = "fr"): string => {
        const dateTime = DateTime.fromISO(dateStr).setLocale(locale);
        return dateTime.toLocaleString({ month: "2-digit", year: "numeric", hour12: false }); // 24-hour format
    };
}

export default DateFormat;