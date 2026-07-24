import { expect, test } from 'vitest'
import { readAddress, buildUpdatePayload, ADDRESS_KEYS } from '../address-logic'

function getterFrom(values: Record<string, string>) {
	return (name: string) => values[name] ?? ''
}

const SHIP = {
	email: 'a@b.com',
	first_name: 'Ada', last_name: 'Lovelace', address_1: '1 St', address_2: 'Apt 2',
	city: 'Town', province: 'us-ca', postal_code: '90210', country_code: 'us', phone: '555'
}

test('readAddress pulls the unprefixed fields', () => {
	const a = readAddress(getterFrom(SHIP))
	expect(a).toEqual({
		first_name: 'Ada', last_name: 'Lovelace', address_1: '1 St', address_2: 'Apt 2',
		city: 'Town', province: 'us-ca', postal_code: '90210', country_code: 'us', phone: '555', company: undefined
	})
})

test('readAddress honors a prefix', () => {
	const a = readAddress(getterFrom({ billing_city: 'Bill City', billing_country_code: 'ca' }), 'billing_')
	expect(a.city).toBe('Bill City')
	expect(a.country_code).toBe('ca')
})

test('buildUpdatePayload mirrors shipping into billing when showBilling is false', () => {
	const p = buildUpdatePayload(getterFrom(SHIP), false)
	expect(p.email).toBe('a@b.com')
	expect(p.billing_address).toEqual(p.shipping_address)
})

test('buildUpdatePayload reads billing_ fields when showBilling is true', () => {
	const values = { ...SHIP, billing_first_name: 'Grace', billing_country_code: 'ca' }
	const p = buildUpdatePayload(getterFrom(values), true)
	expect(p.billing_address?.first_name).toBe('Grace')
	expect(p.billing_address?.country_code).toBe('ca')
	expect(p.shipping_address?.first_name).toBe('Ada')
})

test('ADDRESS_KEYS covers the nine address fields', () => {
	expect(ADDRESS_KEYS).toContain('country_code')
	expect(ADDRESS_KEYS).toHaveLength(9)
})
