describe('Конструктор бургеров', function() {
  beforeEach(function() {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' }).as('getUser');
    cy.intercept('POST', 'api/orders', { fixture: 'order.json' }).as('createOrder');
    
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  describe('Добавление ингредиентов в конструктор', function() {
    it('Булочка должна добавляться в конструктор по клику на кнопку добавления', function() {
      cy.get('[data-cy=ingredient-bun]').first().parents('[data-cy=ingredient-item]').as('bunCard');
      cy.get('@bunCard').contains('button', 'Добавить').click();
      
      cy.get('[data-cy=constructor-bun]').should('exist');
      cy.get('[data-cy=constructor-bun-bottom]').should('exist');
    });

    it('Начинка должна добавляться в конструктор по клику на кнопку добавления', function() {
      cy.get('[data-cy=ingredient-main]').first().parents('[data-cy=ingredient-item]').as('mainCard');
      cy.get('@mainCard').contains('button', 'Добавить').click();
      
      cy.get('[data-cy=constructor-ingredients]').should('exist');
    });
  });

  describe('Удаление ингредиентов из конструктора', function() {
  beforeEach(function() {
    cy.get('[data-cy=ingredient-main]').first().parents('[data-cy=ingredient-item]').as('mainCard');
    cy.get('@mainCard').contains('button', 'Добавить').click();
  });

  it('Ингридиент должен удальяться из конструктора по клику на кнопку удаления', function() {
    cy.get('[data-cy=constructor-ingredients]').should('exist');
    cy.get('[data-cy=constructor-ingredients]')
      .find('.constructor-element__action')
      .first()
      .click();
    cy.get('[data-cy=no-ingredients-message]').should('exist').and('contain', 'Выберите начинку');
    cy.get('[data-cy=constructor-ingredients]').find('.constructor-element').should('not.exist');
  });
});

describe('Модальные окна', function() {
  it('При нажатии на карточку должно открываться модальное окно с деталями ингредиента', function() {
    cy.get('[data-cy=ingredient-item]').first().click();
    cy.get('[data-cy=modal]').should('be.visible');
    cy.get('[data-cy=ingredient-details]').should('exist');
    cy.get('[data-cy=ingredient-name]').should('not.be.empty');
    cy.get('[data-cy=ingredient-calories]').should('not.be.empty');
  });

  it('Модальное окно должно закрываться по клику на крестик', function() {
    cy.get('[data-cy=ingredient-item]').first().click();
    cy.get('[data-cy=modal]').should('be.visible');
    cy.get('[data-cy=modal-close]').click();
    cy.get('[data-cy=modal]').should('not.exist');
  });

  it('Модальное окно должно закрываться по клику на оверлей', function() {
    cy.get('[data-cy=ingredient-item]').first().click();
    cy.get('[data-cy=modal]').should('be.visible');
    cy.get('[data-cy=modal-overlay]').click({ force: true });
    cy.get('[data-cy=modal]').should('not.exist');
  });
});

  describe('Создание заказа', function() {
    beforeEach(function() {
      window.localStorage.setItem('refreshToken', 'test-refresh-token');
      document.cookie = 'accessToken=test-access-token';
    });

    afterEach(function() {
      window.localStorage.removeItem('refreshToken');
      document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    });

    it('Должен создаваться заказ после добавления ингредиентов и по клику на кнопку оформления', function() {
      cy.get('[data-cy=ingredient-bun]').first().parents('[data-cy=ingredient-item]').as('bunCard');
      cy.get('@bunCard').contains('button', 'Добавить').click();
      cy.get('[data-cy=ingredient-main]').first().parents('[data-cy=ingredient-item]').as('mainCard');
      cy.get('@mainCard').contains('button', 'Добавить').click();
      cy.get('[data-cy=order-button]').click();
      cy.get('[data-cy=modal]').should('be.visible');
      cy.contains('12345').should('exist');
      cy.get('[data-cy=modal-close]').click();
      cy.get('[data-cy=modal]').should('not.exist');
      cy.get('[data-cy=no-bun-message]').should('exist').and('contain', 'Выберите булки');
      cy.get('[data-cy=no-ingredients-message]').should('exist').and('contain', 'Выберите начинку');
      cy.get('[data-cy=no-bun-bottom-message]').should('exist').and('contain', 'Выберите булки');
      cy.get('[data-cy=constructor-bun]').should('not.exist');
      cy.get('[data-cy=constructor-ingredients]').find('[data-cy^=constructor-]').should('not.exist');
    });
  });
});
