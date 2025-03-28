import * as cookieUtils from '../../src/utils/cookie';
import { SELECTORS } from '../support/selectors';

describe('Create Order', () => {
  beforeEach(() => {
    cy.stub(cookieUtils, 'getCookie').returns(
      'mockedAccessTokenWithManyCharacters'
    );
    cy.intercept('GET', 'api/auth/user', {
      fixture: 'user.json'
    }).as('getUser');

    cy.visit('');
  });
  it('responding to a user data request', () => {
    cy.wait('@getUser').then((interception) => {
      if (interception.response) {
        expect(interception.response.statusCode).to.equal(200);
        expect(interception.response.body).to.deep.equal({
          success: true,
          user: {
            email: 'someemail@yandex.ru',
            name: 'somename'
          }
        });
      } else {
        throw new Error('Response data is undefined');
      }
    });

    const containerBuns = cy
      .get(`[data-cy=${'643d69a5c3f7b9001cfa093d'}]`)
      .find('button')
      .click();
    const containerMainsFillets = cy
      .get(`[data-cy=${'643d69a5c3f7b9001cfa093e'}]`)
      .find('button')
      .click();
    const containerMainsSteak = cy
      .get(`[data-cy=${'643d69a5c3f7b9001cfa0940'}]`)
      .find('button')
      .click();
    const containerSouces = cy
      .get(`[data-cy=${'643d69a5c3f7b9001cfa0943'}]`)
      .find('button')
      .click();

    cy.intercept('POST', 'api/orders', {
      fixture: 'order.json'
    }).as('getOrders');

    const createOrderButton = cy
      .get(`[data-cy=${'burger-constructor-button'}]`)
      .click();

    cy.wait('@getOrders').then((interception) => {
      if (interception.response) {
        expect(interception.response.body.order).contains({
          status: 'done',
          number: 71793
        });

        cy.get(SELECTORS.MODAL).within(() => {
          cy.get('h2').should('contain', '71793');
          cy.get('button').click();
        });
      }
    });

    cy.get(SELECTORS.MODAL).should('not.exist');

    cy.get(SELECTORS.CONSTRUCTOR).contains('Выберите булки');
    cy.get(SELECTORS.CONSTRUCTOR).contains('Выберите начинку');
  });
});
