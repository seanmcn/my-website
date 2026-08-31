/* eslint-disable no-undef */

const MERMAID_VIEWER_CLOSE_BUTTON =
  '.mermaidViewerActions button[aria-label="Close Mermaid diagram viewer"]';
const MERMAID_VIEWER_RESET_ZOOM_BUTTON =
  '.mermaidZoomControls button[aria-label="Reset Mermaid diagram zoom"]';
const MERMAID_VIEWER_ROTATE_BUTTON =
  '.mermaidViewerActions ' +
  'button[aria-label="Rotate Mermaid diagram within fullscreen viewer"]';
const MERMAID_VIEWER_ZOOM_IN_BUTTON =
  '.mermaidZoomControls button[aria-label="Zoom in Mermaid diagram"]';
const MERMAID_VIEWER_ZOOM_OUT_BUTTON =
  '.mermaidZoomControls button[aria-label="Zoom out Mermaid diagram"]';

describe('Library item pages', () => {
  describe('A post', () => {
    beforeEach(() => {
      cy.visit('/library/2022/07/gitlab-ci-commit-and-push-in-job/');
      cy.get('#postMainColumn');
    });

    it('Displays the title, date and category in the item chrome', () => {
      cy.get('.itemBar__title')
          .should('contain.text', 'Gitlab CI - Commit & Push in a Job');
      cy.get('.itemBar__date').should('contain.text', '26 Jul 2022');
      cy.get('.itemPage__categoryLink')
          .should('contain.text', 'Systems')
          .and('have.attr', 'href', '/library/categories/systems/');
    });

    it('Marks the item as a post', () => {
      cy.get('.itemPage').should('have.attr', 'data-type', 'post');
      cy.get('.itemPage__kind').should('contain.text', 'Post');
    });

    it('Displays tags that link into the library', () => {
      cy.get('.itemPage__tags').within(() => {
        cy.get('.itemPage__tag').should('have.length.at.least', 1);
        cy.contains('a', 'How To');
        cy.contains('a', 'Git');
        cy.contains('a', 'GitLab');
        cy.contains('a', 'CI');
      });
      cy.contains('.itemPage__tag', 'Git')
          .should('have.attr', 'href')
          .and('match', /^\/library\/tags\//);
    });

    it('Shows read time and related items in the rail', () => {
      cy.get('#postSidebarColumn').within(() => {
        cy.contains('.railBlock__label', 'Read time');
        cy.contains('.railBlock__label', 'Related');
        cy.get('.itemRail__related').should('have.length.at.least', 1);
      });
    });

    it('Offers a reply link that carries the item across to contact', () => {
      cy.contains('.itemPage__endRight a', 'Get in touch about this').click();
      cy.location('pathname').should('eq', '/contact/');
      cy.get('.contactReply__title')
          .should('contain.text', 'Gitlab CI - Commit & Push in a Job');
      cy.get('input[name="about"]')
          .should('have.attr', 'value')
          .and('contain', '/library/2022/07/gitlab-ci-commit-and-push-in-job/');
    });

    it('Renders code blocks with a language label and copy control', () => {
      cy.get('.codeWrapper').should('have.length.at.least', 1);
      cy.get('.codeWrapper').first().within(() => {
        cy.get('.codeLanguage').should('be.visible');
        cy.contains('.codeCopyButton', 'Copy');
        cy.get('pre code').should('exist');
      });
    });

    it('Displays the featured image', () => {
      cy.get('#postMainColumn .featuredImage').should('be.visible');
      cy.get('#postMainColumn .featuredImage picture img')
          .should('have.attr', 'alt', 'Gitlab CI - Commit & Push in a Job');
    });
  });

  describe('A find', () => {
    it('Leads with its source link and carries no read time', () => {
      cy.visit('/library/finds/');
      cy.get('.itemRow[data-type="find"]').should('have.length.at.least', 0);
    });
  });

  describe('The library index', () => {
    beforeEach(() => {
      cy.visit('/library/');
    });

    it('Lists items with type filters', () => {
      cy.get('.itemRow').should('have.length.at.least', 1);
      cy.get('.libraryFilters__link').should('have.length', 4);
      cy.contains('.libraryFilters__link', 'Posts').click();
      cy.location('pathname').should('eq', '/library/posts/');
      cy.get('.itemRow[data-type="post"]').should('have.length.at.least', 1);
    });

    it('Filters by category from the rail', () => {
      cy.contains('.facetRow', 'Systems').click();
      cy.location('pathname').should('eq', '/library/categories/systems/');
      cy.get('.itemRow').should('have.length.at.least', 1);
    });

    it('Links through to the full tag index', () => {
      cy.contains('.libraryRail__allTags', 'tags').click();
      cy.location('pathname').should('eq', '/library/tags/');
      cy.get('.tagsPage__row').should('have.length.at.least', 10);
    });

    it('Paginates', () => {
      cy.get('.libraryPagination__status').should('contain.text', 'Page 1 of');
      cy.contains('.libraryPagination__step', 'Next').click();
      cy.location('pathname').should('eq', '/library/page/2/');
      cy.get('.itemRow').should('have.length.at.least', 1);
    });
  });

  describe('Search', () => {
    it('Finds items by keyword and facets them by type', () => {
      cy.visit('/search/');
      cy.get('.searchPage__input').type('continuous integration');
      cy.get('.itemRow').should('have.length.at.least', 1);
      cy.get('.itemRow').first().should('contain.text', 'Gitlab CI');
      cy.get('.searchFacet').should('have.length.at.least', 4);
    });

    it('Opens from the header and closes back', () => {
      cy.visit('/library/');
      cy.get('.siteHeader__search').click();
      cy.location('pathname').should('eq', '/search/');
      cy.get('.searchPage__input').should('be.focused');
    });

    it('Reports when nothing matches', () => {
      cy.visit('/search/');
      cy.get('.searchPage__input').type('zzzznotathing');
      cy.contains('.libraryEmpty__title', 'Nothing matched that');
    });
  });

  describe('Legacy /blog addresses', () => {
    it('Redirects an old post URL to its library address', () => {
      cy.request({
        url: '/blog/2022/07/gitlab-ci-commit-and-push-in-job/',
        followRedirect: false,
      }).then((response) => {
        expect(response.body)
            .to.contain('/library/2022/07/gitlab-ci-commit-and-push-in-job/');
      });
    });
  });

  describe('RTS series navigator', () => {
    it('Shows the ordered series navigator on week one', () => {
      cy.visit('/library/2016/09/making-simple-rts-game-week-one/');
      cy.get('#postMainColumn');

      cy.get('.series').within(() => {
        cy.contains('Part 1 of 3 in Simple RTS Game');
        cy.get('.series__item').should('have.length', 3);
        cy.get('.series__item').eq(0).should('have.class', 'is-current');
        cy.get('.series__item').eq(1).find('a')
            .should('have.attr', 'href')
            .and('match', /week-two/);
      });
    });
  });

  describe('Legacy markdown post - GFM table rendering', () => {
    beforeEach(() => {
      cy.visit('/library/2014/10/what-programmers-say-vs-what-they-mean/');
      cy.get('#postMainColumn');
    });

    it('Renders the markdown table as HTML', () => {
      cy.get('.prose table').should('exist');
      cy.get('.prose table thead').within(() => {
        cy.contains('th', 'What we say');
        cy.contains('th', 'What we mean');
      });
      cy.get('.prose table tbody').contains('td', 'Horrible hack');
    });
  });

  describe('Volume Mixer post - embedded image', () => {
    beforeEach(() => {
      cy.visit('/library/2021/05/turn-up-volume-mixer/');
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

  describe('World models post - Mermaid diagram', () => {
    beforeEach(() => {
      cy.visit('/library/2026/04/what-are-world-models-in-ai/');
      cy.get('#postMainColumn');
    });

    it('Renders Mermaid fenced blocks as SVG diagrams', () => {
      cy.get('.mermaidWrapper')
          .should('have.length.at.least', 1)
          .first()
          .should('have.attr', 'data-mermaid-state', 'rendered');

      cy.get('.mermaidWrapper').first().find('.mermaidRendered svg')
          .should('have.length', 1);
      cy.get('.mermaidWrapper').first()
          .contains('button', 'Fullscreen')
          .should('be.visible');
      cy.get('.mermaidWrapper').first().find('.mermaidRendered')
          .should('contain.text', 'Current state')
          .and('contain.text', 'World model')
          .and('contain.text', 'Predict possible futures')
          .and('contain.text', 'Choose action')
          .and('contain.text', 'New state');
      cy.get('.mermaidWrapper').first().find('.mermaidFallback')
          .should('not.be.visible');

      cy.contains('.prose', 'The mental model that helped');
    });

    it(
        'Opens Mermaid diagrams in a fullscreen viewer with rotation controls',
        () => {
          cy.get('.mermaidWrapper').first()
              .contains('button', 'Fullscreen')
              .click();

          cy.get('.mermaidViewerModal')
              .should('be.visible')
              .and('contain.text', 'Diagram viewer');
          cy.get('.mermaidViewerRendered')
              .should('contain.text', 'Current state')
              .and('contain.text', 'Choose action');
          cy.get('.mermaidViewerCanvas')
              .should('have.attr', 'data-rotated', 'false')
              .and('have.attr', 'data-zoom', '100')
              .then(($canvas) => {
                expect($canvas[0].scrollLeft).to.equal(0);
                expect($canvas[0].scrollTop).to.equal(0);

                const canvasRect = $canvas[0].getBoundingClientRect();

                cy.get('.mermaidViewerStage').then(($stage) => {
                  const stageRect = $stage[0].getBoundingClientRect();

                  expect(stageRect.left + stageRect.width / 2)
                      .to.be.closeTo(canvasRect.left + canvasRect.width / 2, 4);
                  expect(stageRect.top + stageRect.height / 2)
                      .to.be.closeTo(canvasRect.top + canvasRect.height / 2, 4);
                });
              });

          cy.get(MERMAID_VIEWER_ZOOM_IN_BUTTON).click();
          cy.get('.mermaidViewerCanvas')
              .should('have.attr', 'data-zoom', '125')
              .and('have.attr', 'data-pannable', 'true');
          cy.get(MERMAID_VIEWER_RESET_ZOOM_BUTTON).click();
          cy.get('.mermaidViewerCanvas')
              .should('have.attr', 'data-zoom', '100');

          cy.get(MERMAID_VIEWER_ROTATE_BUTTON).click();
          cy.get('.mermaidViewerCanvas')
              .should('have.attr', 'data-rotated', 'true');
          cy.get('.mermaidViewerStage').then(($stage) => {
            const stageRect = $stage[0].getBoundingClientRect();

            cy.get('.mermaidViewerRendered').then(($rendered) => {
              const renderedRect = $rendered[0].getBoundingClientRect();

              expect(renderedRect.width).to.be.greaterThan(0);
              expect(renderedRect.height).to.be.greaterThan(0);
              expect(renderedRect.right).to.be.greaterThan(stageRect.left);
              expect(renderedRect.bottom).to.be.greaterThan(stageRect.top);
              expect(renderedRect.left).to.be.lessThan(stageRect.right);
              expect(renderedRect.top).to.be.lessThan(stageRect.bottom);
            });
          });

          cy.get(MERMAID_VIEWER_CLOSE_BUTTON).click();
          cy.get('.mermaidViewerModal').should('not.exist');
        },
    );

    it('Uses a mobile-friendly Mermaid viewer on narrow screens', () => {
      cy.viewport('iphone-x');
      cy.visit('/library/2026/04/what-are-world-models-in-ai/');
      cy.get('#postMainColumn');

      cy.get('.mermaidWrapper').first()
          .contains('button', 'Fullscreen')
          .click();

      cy.get('.mermaidViewerModal')
          .should('be.visible')
          .then(($modal) => {
            cy.window().then((win) => {
              expect($modal[0].getBoundingClientRect().width)
                  .to.be.closeTo(win.innerWidth, 2);
            });
          });

      cy.get(MERMAID_VIEWER_ZOOM_OUT_BUTTON).click();
      cy.get('.mermaidViewerCanvas')
          .should('have.attr', 'data-zoom', '75');
      cy.get(MERMAID_VIEWER_ZOOM_IN_BUTTON).click().click();
      cy.get('.mermaidViewerCanvas')
          .should('have.attr', 'data-pannable', 'true');
      cy.get('.mermaidViewerCanvas').then(($canvas) => {
        $canvas[0].scrollLeft = 40;
        $canvas[0].scrollTop = 12;
      });
      cy.get(MERMAID_VIEWER_RESET_ZOOM_BUTTON).click();
      cy.get('.mermaidViewerCanvas')
          .should('have.attr', 'data-zoom', '100')
          .then(($canvas) => {
            expect($canvas[0].scrollLeft).to.equal(0);
            expect($canvas[0].scrollTop).to.equal(0);
          });
      cy.get(MERMAID_VIEWER_ROTATE_BUTTON).click();
      cy.get('.mermaidViewerCanvas')
          .should('have.attr', 'data-rotated', 'true');
    });
  });

  describe('Screen cheat sheet - command table', () => {
    beforeEach(() => {
      cy.visit('/library/cheat-sheets/screen/');
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

  describe('RTS week two post - YouTube embed', () => {
    beforeEach(() => {
      cy.visit('/library/2016/09/making-simple-rts-game-week-two/');
      cy.get('#postMainColumn');
    });

    it('Renders a responsive YouTube iframe from a YouTube URL', () => {
      cy.get('#postMainColumn .videoEmbed')
          .should('have.length', 1)
          .within(() => {
            cy.get('iframe')
                .should('have.attr', 'src', 'https://www.youtube.com/embed/q2V6toXFCH0')
                .and('have.attr', 'title', 'Embedded YouTube video')
                .and('have.attr', 'allowfullscreen');
          });
    });
  });
});
