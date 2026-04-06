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

    it('Defines inverted selection styling for article text', () => {
      cy.document().then((doc) => {
        const selectionRules = [];
        const rootStyles = getComputedStyle(doc.documentElement);
        const activeTheme = doc.documentElement.dataset.theme;
        const selectionBackground = rootStyles.getPropertyValue(
            '--selection-background',
        ).trim();
        const selectionColor = rootStyles.getPropertyValue(
            '--selection-color',
        ).trim();

        Array.from(doc.styleSheets).forEach((styleSheet) => {
          let rules;
          try {
            rules = styleSheet.cssRules;
          } catch (error) {
            return;
          }

          if (!rules) {
            return;
          }

          Array.from(rules).forEach((rule) => {
            if (
              rule.selectorText &&
              rule.selectorText.includes(
                  '.content.blog-post-content p::selection',
              )
            ) {
              selectionRules.push(rule);
            }
          });
        });

        expect(selectionRules.length).to.be.greaterThan(0);
        expect(selectionRules[0].style.background).to.equal(
            'var(--selection-background)',
        );
        expect(selectionRules[0].style.color).to.equal(
            'var(--selection-color)',
        );
        if (activeTheme === 'dark') {
          expect(selectionBackground).to.equal('#d9edf2');
          expect(selectionColor).to.equal('#081219');
        } else {
          expect(selectionBackground).to.equal('#13212f');
          expect(selectionColor).to.equal('#f5f7f9');
        }
      });
    });

    it('Search modal returns keyword matches and browse filters', () => {
      cy.contains('button', 'Search').click();
      cy.get('.searchModal').should('be.visible');
      cy.contains('.searchBrowseLabel', 'Browse popular categories');
      cy.get('input[aria-label="Search blog posts"]')
          .type('continuous integration');
      cy.get('.searchResults-list .searchResult-item').should(
          'have.length.at.least',
          1,
      );
      cy.get('.searchResults-list .searchResult-item').first()
          .should('contain.text', 'GitLab CI');
      cy.get('.searchFilterChip').should('have.length.at.least', 1);
    });
  });

  describe('Mobile drawer blog browse', () => {
    beforeEach(() => {
      cy.viewport('iphone-x');
      cy.visit('/blog/2022/07/gitlab-ci-commit-and-push-in-job/');
      cy.get('#postMainColumn');
    });

    it(
        'shows categories and tags in the mobile drawer and hides the ' +
        'sidebar column',
        () => {
          cy.get('#postSidebarColumn').should('not.be.visible');
          cy.get('.navbar-brand > .button').click();
          cy.get('.siteNavbarDrawer').should('have.class', 'is-active');
          cy.contains('.siteNavbarDrawerSectionTitle', 'Browse blog');
          cy.get('.siteNavbarDrawer .categoryList--drawer li')
              .should('have.length.at.least', 1);
          cy.get('.siteNavbarDrawer .tagsList--drawer .tagChipLink')
              .should('have.length.at.least', 1);
        },
    );

    it('closes the drawer after selecting a category link', () => {
      cy.get('.navbar-brand > .button').click();
      cy.get('.siteNavbarDrawer .categoryList--drawer a').first().click();
      cy.location('pathname').should('match', /^\/blog\/categories\//);
      cy.get('.siteNavbarDrawer').should('not.have.class', 'is-active');
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

  describe('Workflow post - bash syntax highlighting', () => {
    beforeEach(() => {
      cy.visit('/blog/2025/07/claude-code-git-worktrees-docker/');
      cy.get('#postMainColumn');
    });

    it('Renders bash code blocks with syntax markup', () => {
      cy.get('.codeWrapper[data-language="bash"]')
          .should('have.length.at.least', 1)
          .first()
          .within(() => {
            cy.get('pre').should('exist');
            cy.get('pre span').should('have.length.at.least', 1);
            cy.contains('git worktree add');
          });
    });
  });

  describe('World models post - Mermaid diagram', () => {
    beforeEach(() => {
      cy.visit('/blog/2026/04/what-are-world-models-in-ai/');
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

      cy.contains('#postMainColumn .content', 'The mental model that helped');
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
      cy.visit('/blog/2026/04/what-are-world-models-in-ai/');
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

  describe('RTS week two post - YouTube embed', () => {
    beforeEach(() => {
      cy.visit('/blog/2016/09/making-simple-rts-game-week-two/');
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
