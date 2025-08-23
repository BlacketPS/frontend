export const formatTimeRemaining = (expiresAt: Date): string => {
    const now = new Date();
    const diff = expiresAt.getTime() - now.getTime();

    if (diff <= 0) return "Expired";

    const seconds = Math.floor((diff / 1000) % 60);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days > 1) {
        return `${days}d ${hours}h ${minutes}m`;
    } else if (hours >= 1) {
        return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes >= 1) {
        return `${minutes}m ${seconds}s`;
    } else {
        return `${seconds}s`;
    }
};
