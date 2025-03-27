describe('Ingredients Slice', () => {
  it('should display mock ingredients', () => {
    cy.intercept('GET', 'https://norma.nomoreparties.space/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');
    cy.visit('http://localhost:4000/');
    cy.wait('@getIngredients').its('response.statusCode').should('eq', 200);
    const containerBuns = cy.get(`[data-cy=${'643d69a5c3f7b9001cfa093c'}]`);
    containerBuns.find('button').click();
    const contsinerMains = cy.get(`[data-cy=${'643d69a5c3f7b9001cfa0941'}]`);
    contsinerMains.find('button').click();
  });
});
