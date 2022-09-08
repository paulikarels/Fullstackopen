describe("Blog app", function () {
  beforeEach(function () {
    cy.request("POST", "http://localhost:3003/api/testing/reset");
    const user = {
      name: "Pauli Karels",
      username: "paulik",
      password: "qwe",
    };
    cy.request("POST", "http://localhost:3000/api/users/", user);
    cy.visit("http://localhost:3000");
  });

  it("Login form is shown", function () {
    cy.contains("log in to application");
    cy.contains("login");
  });

  describe("Login", function () {
    it("succeeds with correct credentials", function () {
      cy.get("#username").type("paulik");
      cy.get("#password").type("qwe");
      cy.get("#login-button").click();

      cy.contains("Pauli Karels logged in");
    });

    it("fails with wrong credentials", function () {
      cy.get("#username").type("väärä");
      cy.get("#password").type("väärä");
      cy.get("#login-button").click();

      cy.get(".error")
        .should("contain", "wrong username or password")
        .and("have.css", "color", "rgb(255, 0, 0)");
    });
  });

  describe("When logged in", function () {
    beforeEach(function () {
      // log in user here
      cy.get("#username").type("paulik");
      cy.get("#password").type("qwe");
      cy.get("#login-button").click();
    });

    it("A blog can be created", function () {
      cy.contains("new blog").parent().find("button").as("theButton");
      cy.get("@theButton").click();

      cy.get('input[name="title"]').type("Blog for Cypress");
      cy.get('input[name="author"]').type("Testi Tero");
      cy.get('input[name="url"]').type("localhos:3000");

      cy.get("button").contains("create").click();

      cy.get('div[class="success"]')
        .should("contain", "a new blog Blog for Cypress by Testi Tero added")
        .and("have.css", "color", "rgb(0, 128, 0)");
    });

    describe("Editing blogs", function () {
      beforeEach(function () {
        cy.contains("new blog").parent().find("button").as("theButton");
        cy.get("@theButton").click();

        cy.get('input[name="title"]').type("Blog for Cypress");
        cy.get('input[name="author"]').type("Testi Tero");
        cy.get('input[name="url"]').type("localhos:3000");

        cy.get("button").contains("create").click();
      });

      it("A blog can be liked", function () {
        cy.contains("view").parent().find("button").click();
        cy.get("#like").click();
      });

      it("A blog can be deleted", function () {
        cy.contains("view").parent().find("button").click();
        cy.get("#delete").click();
        cy.get("html").should("not.contain", "Blog for Cypress");
      });
    });

    describe("Blogs are ordered correctly", function () {
      beforeEach(function () {
        //First
        cy.contains("new blog").parent().find("button").as("theButton");
        cy.get("@theButton").click();

        cy.get('input[name="title"]').type("First Blog");
        cy.get('input[name="author"]').type("Testi Tero");
        cy.get('input[name="url"]').type("localhos:3000");

        cy.get("button").contains("create").click();
      });

      it("A blog can be liked", function () {
        cy.contains("new blog").parent().find("button").as("theButton");
        cy.get("@theButton").click();

        cy.get('input[name="title"]').type("Second Blog");
        cy.get('input[name="author"]').type("Testi Tero");
        cy.get('input[name="url"]').type("localhos:3000");

        cy.get("button").contains("create").click();

        cy.contains("Second Blog").parent().find("button").click();
        cy.get("#like").click().wait(500).click().wait(500);

        cy.get(".blog").eq(0).should("contain", "Second Blog");
        cy.get(".blog").eq(1).should("contain", "First Blog");
      });
    });
  });
});
