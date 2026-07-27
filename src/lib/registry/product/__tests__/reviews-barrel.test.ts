import { expect, test } from 'vitest'
import * as Product from '$lib/components/ui/product'

test('exposes the nested Product.Reviews namespace + Rating + Star', () => {
	expect(Product.Rating).toBeTruthy()
	expect(Product.Star).toBeTruthy()
	expect(Product.Reviews.Summary.Histogram.Bar).toBeTruthy()
	expect(Product.Reviews.Review.Rating).toBeTruthy()
	expect(Product.Reviews.Pagination.Next).toBeTruthy()
})

test('exposes the nested Product.Reviews.Form namespace', () => {
	expect(Product.Reviews.Form.Root).toBeTruthy()
	expect(Product.Reviews.Form.Rating).toBeTruthy()
	expect(Product.Reviews.Form.Submit).toBeTruthy()
	expect(Product.Reviews.Form.Cancel).toBeTruthy()
	expect(Product.Reviews.Form.Author).toBeTruthy()
	expect(Product.Reviews.Form.Body).toBeTruthy()
	expect(Product.Reviews.Form.Error).toBeTruthy()
})
