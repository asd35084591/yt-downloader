beforeEach(function () {

})
describe('load /', () => {
    it('Can go to /', () => {
        cy.request('/')
    })
    it('should have /log href', () => {
        cy.visit('/')
        cy.get("h1").children('a').should('have.attr', 'href', 'log')
    })
    it('should have url input', () => {
        cy.get(".input-container").children("input[id='link']").should('have.attr', 'type', 'url')
    })
    it('should have radio selector', () => {
        cy.get(".radiodd").children("input[id='b']").should('have.attr', 'type', 'radio').should('have.attr', 'value', 'b')
        cy.get(".radiodd").children("input[id='bv']").should('have.attr', 'type', 'radio').should('have.attr', 'value', 'bv')
        cy.get(".radiodd").children("input[id='ba']").should('have.attr', 'type', 'radio').should('have.attr', 'value', 'ba')
        cy.get(".radiodd").children("input[id='bv&ba']").should('have.attr', 'type', 'radio').should('have.attr', 'value', 'bestvideo+bestaudio')
        cy.get(".radiodd").children("input[id='no']").should('have.attr', 'type', 'radio').should('have.attr', 'value', '--no-playlist')
        cy.get(".radiodd").children("input[id='yes']").should('have.attr', 'type', 'radio').should('have.attr', 'value', '--yes-playlist')
    })
    it('should have download button', () => {
        cy.get("form").children("input[type='button']").should('have.attr', 'id', 'download')
    })
    it('should have std output log', () => {
        cy.get("div").children("p[id='stdout']")
        cy.get("div").children("p[id='stderr']")
    })
});

describe('load /log', () => {
    it('Can go to /log', () => {
        cy.request('/log')
    })
    it('should have / href', () => {
        cy.visit('/log')
        cy.get("h1").children('a').should('have.attr', 'href', '/')
    })
    it('should have audio container', () => {
        cy.get("ul[id='audio']")
    })
    it('should have video container', () => {
        cy.get("ul[id='video']")
    })
})

describe('functionality', () => {
    it('radio/checkbox selector can be checked', () => {
        cy.visit('/')
        cy.get(".input-container").children("input[id='link']").clear()
        cy.get(".radiodd").children("input[id='b']").click({force: true})
        cy.get(".radiodd").children("input[id='bv']").click({force: true})
        cy.get(".radiodd").children("input[id='ba']").click({force: true})
        cy.get(".radiodd").children("input[id='bv&ba']").click({force: true})
        cy.get(".radiodd").children("input[id='yes']").click({force: true})
        cy.get(".radiodd").children("input[id='no']").click({force: true})
        cy.get(".radiodd").children("input[id='thumbnail']").click({force: true})
        cy.get(".radiodd").children("input[id='subtitle']").click({force: true})
    })
    it('should trigger an alert with a failed message', () => {
        cy.get('#link').clear()
        cy.get("form").children("input[id=download]").click()
        cy.get('#link').type("https://www.youtube.com/watch?v=testtest")
        cy.get("form").children("input[id=download]").click().wait(1000).then(()=>{
            cy.get("#stderr").contains("Error code")
            cy.on('window:alert', (text) => {
                expect(text).to.contains('這不是一個youtube link!');
            });
            
        })
    });
    it('can download thumbnail', () => {
        cy.get('#link').clear()
        cy.get('#link').type("https://www.youtube.com/watch?v=9ZEURntrQOg")
        cy.get(".radiodd").children("input[id='subtitle']").click({force: true})
        cy.get("form").children("input[id=download]").click().then(()=>{
            cy.get('#test-downloadThumb').should('be.checked')
        })
    })
    it("can download subtitle", () => {
        cy.get('#link').clear()
        cy.get('#link').type("https://www.youtube.com/watch?v=zhqvxdx8kIM")
        cy.get(".radiodd").children("input[id='ba']").click({force: true})
        cy.get(".radiodd").children("input[id='subtitle']").click({force: true})
        cy.get("form").children("input[id=download]").click().then(()=>{
            cy.get('#test-downloadSub').should('be.checked')
        })
    })
    describe("audio related", () => {
        it('start downloading audio', () => {
            cy.get('#link').clear()
            cy.get('#link').type("https://www.youtube.com/watch?v=fnlJw9H0xAM")
            cy.get(".radiodd").children("input[id='subtitle']").click({force: true})
            cy.get("form").children("input[id=download]").click()
        })
        it('can download audio', () => {
            cy.get('#test-download-audio').should('be.checked')
        })
        it('can embed sub to audio', () => {
            cy.get('#test-embedSub-audio').should('be.checked')
        })
        it('can embed metadata to audio', () => {
            cy.get('#test-embedMeta-audio').should('be.checked')
        })
    })
    describe("video related", () => {
        it('start downloading video', () => {
            cy.get('#link').clear()
            cy.get('#link').type("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
            cy.get(".radiodd").children("input[id='b']").click({force: true})
            cy.get("form").children("input[id=download]").click()
        })
        it('can download video', () => {
            cy.get('#test-download-video').should('be.checked')
        }) 
        it('can embed sub to video', () => {
            cy.get('#test-embedSub-video').should('be.checked')
        })
        it('can embed metadata to video', () => {
            cy.get('#test-embedMeta-video').should('be.checked')
        })
        it('can embed thumbnail to video', () => {
            cy.get('#test-embedThumb-video').should('be.checked')
        })
    })
    
})
