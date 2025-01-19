export const generateGuestId = (): string => {
    const timestamp = Date.now().toString(36)
    const randomPart = Math.random().toString(36).substring(2, 8)
    return `guest_${timestamp}${randomPart}`
}