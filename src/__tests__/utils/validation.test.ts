describe('Input Validation', () => {
  // helper to validate email format
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // helper to validate IATA airport codes
  const isValidIATACode = (code: string): boolean => {
    return /^[A-Z]{3}$/.test(code.toUpperCase())
  }

  describe('email validation', () => {
    it('should return true for valid email', () => {
      expect(isValidEmail('test@example.com')).toBe(true)
    })

    it('should return false for invalid email', () => {
      expect(isValidEmail('invalid-email')).toBe(false)
      expect(isValidEmail('test@')).toBe(false)
      expect(isValidEmail('@example.com')).toBe(false)
    })
  })

  describe('IATA code validation', () => {
    it('should return true for valid 3-letter codes', () => {
      expect(isValidIATACode('JFK')).toBe(true)
      expect(isValidIATACode('LAX')).toBe(true)
      expect(isValidIATACode('lhr')).toBe(true) // lowercase should work
    })

    it('should return false for invalid codes', () => {
      expect(isValidIATACode('JFKK')).toBe(false)
      expect(isValidIATACode('JF')).toBe(false)
      expect(isValidIATACode('12')).toBe(false)
    })
  })
})
