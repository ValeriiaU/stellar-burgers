import { SELECTORS } from '../support/selectors';

describe('Modal tests', () => {
  it('should modal open', () => {
    cy.intercept('GET', 'api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');
    cy.visit('');
    const containerBuns = cy
      .get(`[data-cy=${'643d69a5c3f7b9001cfa093c'}]`)
      .click();

    cy.get(SELECTORS.MODAL).find('button').click();
  });
});
