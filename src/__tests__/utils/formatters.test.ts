describe('Formatters', () => {
  // price formatter
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price)
  }

  // date formatter
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  describe('formatPrice', () => {
    it('should format price with dollar sign', () => {
      expect(formatPrice(100)).toBe('$100.00')
      expect(formatPrice(1234.56)).toBe('$1,234.56')
    })

    it('should handle zero', () => {
      expect(formatPrice(0)).toBe('$0.00')
    })
  })

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2024-06-15T12:00:00')
      expect(formatDate(date)).toBe('Jun 15, 2024')
    })
  })
})
