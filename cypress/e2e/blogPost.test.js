/* eslint-disable no-undef */

describe('Blog post features', () => {
  describe('General blog post elements', () => {
    beforeEach(() => {
      cy.visit('/blog/2022/07/gitlab-ci-commit-and-push-in-job/');
      cy.get('#postMainColumn');
    });

    it('Displays post badges and title', () => {
      cy.get('#postMainColumn .blog-post-box').within(() => {
        cy.get('.blog-post-category-badge a')
          .should('contain.text', 'DevOps')
          .and('have.attr', 'href', '/blog/categories/devops/');
        cy.get('.blog-post-date-badge')
          .should('contain.text', 'July 26, 2022');
        cy.get('.blog-post-title')
          .should('contain.text', 'Gitlab CI - Commit & Push in a Job');
      });
    });

    it('Displays tags on the post', () => {
      cy.get('#postMainColumn .blog-post-tags').within(() => {
        cy.get('.blog-post-tag-chip').should('have.length.at.least', 1);
        cy.contains('a', 'programming');
        cy.contains('a', 'gitlab');
        cy.contains('a', 'devops');
      });
    });

    it('Displays categories widget in sidebar', () => {
      cy.get('#postSidebarColumn').within(() => {
        cy.contains('h1', 'Categories');
        cy.get('.categoryList li').should('have.length.at.least', 1);
      });
    });

    it('Displays tags widget in sidebar', () => {
      cy.get('#postSidebarColumn').within(() => {
        cy.contains('h1', 'Tags');
        cy.get('.tagsList .tagChipLink').should('have.length.at.least', 1);
      });
    });

    it('Displays related posts section', () => {
      cy.get('#postMainColumn').within(() => {
        cy.contains('h2', 'Related Posts');
        cy.get('.relatedPost').should('have.length.at.least', 1);
        cy.get('.relatedPost .tag').should('have.length.at.least', 1);
      });
    });

    it('Search modal returns keyword matches and browse filters', () => {
      cy.contains('button', 'Search').click();
      cy.get('.searchModal').should('be.visible');
      cy.contains('.searchBrowseLabel', 'Browse popular categories');
      cy.get('input[aria-label="Search blog posts"]').type('continuous integration');
      cy.get('.searchResults-list .searchResult-item').should(
          'have.length.at.least',
          1,
      );
      cy.get('.searchResults-list .searchResult-item').first()
          .should('contain.text', 'GitLab CI');
      cy.get('.searchFilterChip').should('have.length.at.least', 1);
    });
  });

  describe('GitLab CI post - code and featured image', () => {
    beforeEach(() => {
      cy.visit('/blog/2022/07/gitlab-ci-commit-and-push-in-job/');
      cy.get('#postMainColumn');
    });

    it('Renders code blocks', () => {
      cy.get('pre code').should('have.length.at.least', 1);
    });

    it('Displays the featured image', () => {
      cy.get('#postMainColumn .featuredImage').should('be.visible');
      cy.get('#postMainColumn .featuredImage picture img')
        .should('have.attr', 'alt', 'Gitlab CI - Commit & Push in a Job');
    });
  });

  describe('Screen cheat sheet - command table', () => {
    beforeEach(() => {
      cy.visit('/blog/cheat-sheets/screen/');
      cy.get('#postMainColumn');
    });

    it('Renders the command table with data', () => {
      cy.get('.table-container table').should('exist');
      cy.get('.table-container table tbody tr')
        .should('have.length.at.least', 20);
    });

    it('Displays table headers', () => {
      cy.get('.table-container table thead').within(() => {
        cy.contains('th', 'Command');
        cy.contains('th', 'Category');
        cy.contains('th', 'Description');
      });
    });

    it('Search filter narrows results', () => {
      cy.get('input[placeholder*="Search"]').as('searchInput');
      cy.get('@searchInput').should('be.visible');

      cy.get('@searchInput').type('Detach');

      cy.get('.table-container table tbody tr')
        .should('have.length.at.least', 1)
        .and('have.length.at.most', 5);

      cy.get('.table-container table tbody').contains('Detach');
    });

    it('Search with no results shows empty message', () => {
      cy.get('input[placeholder*="Search"]').type('xyznonexistent123');
      cy.get('.table-container table tbody tr').should('have.length', 0);
      cy.contains('No results found!');
    });

    it('Clearing search restores all rows', () => {
      cy.get('input[placeholder*="Search"]').as('searchInput');
      cy.get('@searchInput').type('Detach');
      cy.get('.table-container table tbody tr')
        .should('have.length.below', 24);
      cy.get('@searchInput').clear();
      cy.get('.table-container table tbody tr')
        .should('have.length.at.least', 20);
    });
  });

  describe('Legacy markdown post - GFM table rendering', () => {
    beforeEach(() => {
      cy.visit('/blog/2014/10/what-programmers-say-vs-what-they-mean/');
      cy.get('#postMainColumn');
    });

    it('Renders the markdown table as HTML', () => {
      cy.get('#postMainColumn .content table').should('exist');

      cy.get('#postMainColumn .content table thead').within(() => {
        cy.contains('th', 'What we say');
        cy.contains('th', 'What we mean');
      });

      cy.get('#postMainColumn .content table tbody')
          .contains('td', 'Horrible hack');

      cy.contains(
          '#postMainColumn .content',
          '|--------------------------------------|',
      ).should('not.exist');
    });
  });

  describe('Volume Mixer post - embedded image', () => {
    beforeEach(() => {
      cy.visit('/blog/2021/05/turn-up-volume-mixer/');
      cy.get('#postMainColumn');
    });

    it('Displays the featured image', () => {
      cy.get('#postMainColumn .featuredImage').should('be.visible');
    });

    it('Displays the embedded image within post body', () => {
      cy.get('#postMainColumn .gatsby-resp-image-wrapper')
        .should('have.length.at.least', 1);
      cy.get('#postMainColumn .gatsby-resp-image-wrapper img')
        .should('be.visible');
    });
  });
});
