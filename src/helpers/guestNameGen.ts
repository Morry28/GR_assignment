export const generateGuestId = (): string => {
    const randomA = Date.now().toString(36)
    const randomB = Math.random().toString(36).substring(2, 8)
    return `guest_${randomA}${randomB}`
}