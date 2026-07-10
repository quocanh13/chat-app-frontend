export function timeDiff(t: Date) {
    const diff = Date.now() - t.getTime();

    const second = Math.floor(diff / 1000);
    if (second < 60) {
        return `${second}s`;
    }

    const minute = Math.floor(second / 60);
    if (minute < 60) {
        return `${minute}m`;
    }

    const hour = Math.floor(minute / 60);
    if (hour < 24) {
        return `${hour}h`;
    }

    const day = Math.floor(hour / 24);
    if (day < 30) {
        return `${day}d`;
    }

    const month = Math.floor(day / 30);
    if (month < 12) {
        return `${month}mo`;
    }

    const year = Math.floor(day / 365);
    return `${year}y`;
}