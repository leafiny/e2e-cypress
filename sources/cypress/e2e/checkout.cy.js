import data from '../fixtures/leafiny.json'

describe('Place an order', () => {
  let cookie

  beforeEach(() => {
    cy.intercept('POST', '/product/ajax/add/*').as('add-to-cart')
    cy.intercept('POST', '/checkout.html?step=*').as('checkout-next')
    if (cookie) {
      cy.setCookie(cookie.name, cookie.value)
    }
  })

  it('View Homepage', () => {
    cy.visit(data.url.homepage)
    cy.getCookie('frontend')
        .should('exist')
        .then((c) => {
          cookie = c
        })
  })

  it('Add product to cart', () => {
    cy.visit(data.url.product)
    cy.get('.add-to-cart').click()
    cy.wait('@add-to-cart').its('response.statusCode').should('eq', 200)
  })

  it('View Cart', () => {
    cy.visit(data.url.checkout)
    cy.contains(data.product.name).should('exist')
  })

  it('Update item quantity', () => {
    cy.get('.update_item').select('3')
  })

  it('Check the free item cart rule', () => {
    cy.contains(data.cartRule.freeProductName).should('exist')
    cy.get('.continue button').click()
    cy.wait('@checkout-next').its('response.statusCode').should('eq', 200)
  })

  it('Add an address', () => {
    cy.get('input[name="email"]').type(data.address.email)
    cy.get('input[name="shipping[firstname]"]').type(data.address.firstname)
    cy.get('input[name="shipping[lastname]"]').type(data.address.lastname)
    cy.get('input[name="shipping[street_1]"]').type(data.address.street)
    cy.get('input[name="shipping[postcode]"]').type(data.address.postcode)
    cy.get('input[name="shipping[city]"]').type(data.address.city)
    cy.get('select[name="shipping[country_code]"]').select(data.address.country)
    cy.get('input[name="shipping[telephone]"]').type(data.address.telephone)
    cy.get('.continue button').click()
    cy.wait('@checkout-next').its('response.statusCode').should('eq', 200)
  })

  it('Select shipping method', () => {
    cy.get('[type="radio"]').first().check()
    cy.get('.continue button').click()
    cy.wait('@checkout-next').its('response.statusCode').should('eq', 200)
  })

  it('Select payment method', () => {
    cy.get('[type="radio"]').first().check()
    cy.get('.continue button').click()
    cy.wait('@checkout-next').its('response.statusCode').should('eq', 200)
  })

  it('Add a coupon', () => {
    cy.get('input[name="coupon"]').type(data.cartRule.coupon + '{enter}', {"force": true})
    cy.get('.discount').should('exist')
  })

  it('Place Order', () => {
    cy.get('input[name="agreements"]').check()
    cy.get('.continue button').click()
    cy.contains('Thank you for your purchase!')
  })
})
