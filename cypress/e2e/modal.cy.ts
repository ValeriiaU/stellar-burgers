describe('Modal tests', () => {
  it('should modal open', () => {
    cy.intercept('GET', 'https://norma.nomoreparties.space/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');
    cy.visit('http://localhost:4000/');
    const containerBuns = cy
      .get(`[data-cy=${'643d69a5c3f7b9001cfa093c'}]`)
      .click();
    const modal = cy.get(`[data-cy=${'modal'}]`).find('button').click();
  });
});
