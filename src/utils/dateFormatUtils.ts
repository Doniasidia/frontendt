import { DateTime } from "luxon";

/**
 * Utility class for date formatting and comparison using Luxon.
 */
class DateFormat {
    static readonly SimpleDateFormat = "dd/MM/yyyy";
    static readonly SimpleDurationFormat = "h'h':m";
    static readonly MonthYearFormat = "MMM yyyy";

    static getFormattedDate = (dateStr: string, locale: string = "fr"): string => {
        const dateTime = DateTime.fromISO(dateStr).setLocale(locale);
        return dateTime.toFormat(this.SimpleDateFormat);
    };

    static getFormattedMonthYear = (dateStr: string, locale: string = "fr"): string => {
        const dateTime = DateTime.fromISO(dateStr).setLocale(locale);
        return dateTime.toFormat("MMMM yyyy");
    };
}

export default DateFormat;
