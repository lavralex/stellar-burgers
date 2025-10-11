describe('Конструктор бургеров', function() {
  const SELECTORS = {
    INGREDIENT_BUN: '[data-cy=ingredient-bun]',
    INGREDIENT_MAIN: '[data-cy=ingredient-main]',
    INGREDIENT_ITEM: '[data-cy=ingredient-item]',
    CONSTRUCTOR_BUN: '[data-cy=constructor-bun]',
    CONSTRUCTOR_BUN_BOTTOM: '[data-cy=constructor-bun-bottom]',
    CONSTRUCTOR_INGREDIENTS: '[data-cy=constructor-ingredients]',
    NO_BUN_MESSAGE: '[data-cy=no-bun-message]',
    NO_INGREDIENTS_MESSAGE: '[data-cy=no-ingredients-message]',
    NO_BUN_BOTTOM_MESSAGE: '[data-cy=no-bun-bottom-message]',
    MODAL: '[data-cy=modal]',
    MODAL_CLOSE: '[data-cy=modal-close]',
    MODAL_OVERLAY: '[data-cy=modal-overlay]',
    ORDER_BUTTON: '[data-cy=order-button]',
    INGREDIENT_DETAILS: '[data-cy=ingredient-details]',
    INGREDIENT_NAME: '[data-cy=ingredient-name]',
    INGREDIENT_CALORIES: '[data-cy=ingredient-calories]'
  };

  const checkIngredientInConstructor = (ingredientName: string) => {
    cy.get(SELECTORS.CONSTRUCTOR_INGREDIENTS).should('contain', ingredientName);
  };

  const checkBunInConstructor = (bunName: string) => {
    cy.get(SELECTORS.CONSTRUCTOR_BUN).should('contain', bunName);
    cy.get(SELECTORS.CONSTRUCTOR_BUN_BOTTOM).should('contain', bunName);
  };

  const checkIngredientInModal = (ingredientName: string) => {
    cy.get(SELECTORS.INGREDIENT_NAME).should('have.text', ingredientName);
    cy.get(SELECTORS.INGREDIENT_CALORIES).should('not.be.empty');
  };

  const openAndCheckIngredientModal = () => {
    cy.get(SELECTORS.INGREDIENT_ITEM).first().as('ingredient');
    cy.get('@ingredient').find('p').eq(1).invoke('text').as('ingredientName');
    cy.get('@ingredient').click();
    cy.get(SELECTORS.MODAL).should('be.visible');
    cy.get(SELECTORS.INGREDIENT_DETAILS).should('exist');
    cy.get<string>('@ingredientName').then((ingredientName) => {
      checkIngredientInModal(ingredientName);
    });
  };

  const addIngredientAndGetName = (ingredientType: string, aliasSuffix: string = '') => {
    const selector = ingredientType === 'bun' ? SELECTORS.INGREDIENT_BUN : SELECTORS.INGREDIENT_MAIN;
    const aliasName = aliasSuffix ? `ingredientCard${aliasSuffix}` : 'ingredientCard';
    const nameAlias = aliasSuffix ? `ingredientName${aliasSuffix}` : 'ingredientName';
    
    cy.get(selector).first().parents(SELECTORS.INGREDIENT_ITEM).as(aliasName);
    cy.get(`@${aliasName}`).find('p').eq(1).invoke('text').as(nameAlias);
    cy.get(`@${aliasName}`).contains('button', 'Добавить').click();
    return nameAlias;
  };

  beforeEach(function() {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' }).as('getUser');
    cy.intercept('POST', 'api/orders', { fixture: 'order.json' }).as('createOrder');
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  describe('Добавление ингредиентов в конструктор', function() {
    it('Булочка должна добавляться в конструктор по клику на кнопку добавления', function() {
      const ingredientNameAlias = addIngredientAndGetName('bun');
      
      cy.get(SELECTORS.CONSTRUCTOR_BUN).should('exist');
      cy.get(SELECTORS.CONSTRUCTOR_BUN_BOTTOM).should('exist');
      cy.get<string>(`@${ingredientNameAlias}`).then((bunName) => {
        checkBunInConstructor(bunName);
      });
    });

    it('Начинка должна добавляться в конструктор по клику на кнопку добавления', function() {
      const ingredientNameAlias = addIngredientAndGetName('main');
      
      cy.get(SELECTORS.CONSTRUCTOR_INGREDIENTS).should('exist');
      cy.get<string>(`@${ingredientNameAlias}`).then((ingredientName) => {
        checkIngredientInConstructor(ingredientName);
      });
    });
  });

  describe('Удаление ингредиентов из конструктора', function() {
    beforeEach(function() {
      const ingredientNameAlias = addIngredientAndGetName('main');
      cy.get<string>(`@${ingredientNameAlias}`).as('mainIngredientName');
    });

    it('Ингридиент должен удаляться из конструктора по клику на кнопку удаления', function() {
      cy.get(SELECTORS.CONSTRUCTOR_INGREDIENTS).should('exist');
      cy.get<string>('@mainIngredientName').then((ingredientName) => {
        checkIngredientInConstructor(ingredientName);
      });
      
      cy.get(SELECTORS.CONSTRUCTOR_INGREDIENTS)
        .find('.constructor-element__action')
        .first()
        .click();
        
      cy.get(SELECTORS.NO_INGREDIENTS_MESSAGE)
        .should('exist')
        .and('contain', 'Выберите начинку');
      cy.get(SELECTORS.CONSTRUCTOR_INGREDIENTS)
        .find('.constructor-element')
        .should('not.exist');
    });
  });

  describe('Модальные окна', function() {
    it('При нажатии на карточку должно открываться модальное окно с деталями ингредиента', function() {
      openAndCheckIngredientModal();
    });

    it('Модальное окно должно закрываться по клику на крестик', function() {
      openAndCheckIngredientModal();
      
      cy.get(SELECTORS.MODAL_CLOSE).click();
      cy.get(SELECTORS.MODAL).should('not.exist');
    });

    it('Модальное окно должно закрываться по клику на оверлей', function() {
      openAndCheckIngredientModal();
      
      cy.get(SELECTORS.MODAL_OVERLAY).click({ force: true });
      cy.get(SELECTORS.MODAL).should('not.exist');
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
      const bunNameAlias = addIngredientAndGetName('bun', 'Bun');
      const mainNameAlias = addIngredientAndGetName('main', 'Main');

      cy.get<string>(`@${bunNameAlias}`).then((bunName) => {
        checkBunInConstructor(bunName);
      });
      cy.get<string>(`@${mainNameAlias}`).then((mainIngredientName) => {
        checkIngredientInConstructor(mainIngredientName);
      });
      cy.get(SELECTORS.ORDER_BUTTON).click();
      cy.get(SELECTORS.MODAL).should('be.visible');
      cy.contains('12345').should('exist');
      cy.get(SELECTORS.MODAL_CLOSE).click();
      cy.get(SELECTORS.MODAL).should('not.exist');
      cy.get(SELECTORS.NO_BUN_MESSAGE).should('exist').and('contain', 'Выберите булки');
      cy.get(SELECTORS.NO_INGREDIENTS_MESSAGE).should('exist').and('contain', 'Выберите начинку');
      cy.get(SELECTORS.NO_BUN_BOTTOM_MESSAGE).should('exist').and('contain', 'Выберите булки');
      cy.get(SELECTORS.CONSTRUCTOR_BUN).should('not.exist');
      cy.get(SELECTORS.CONSTRUCTOR_INGREDIENTS).find('[data-cy^=constructor-]').should('not.exist');
    });
  });
});
