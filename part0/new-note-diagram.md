sequenceDiagram
    participant browser
    participant server

    Note right of browser: User writes a note in the text field
    Note right of browser: User clicks "Save"

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note
    activate server
    Note right of server: Server saves the new note
    server-->>browser: Responds with 302 asking browser to redirect to /notes
    deactivate server

    browser->> server : GET https://studies.cs.helsinki.fi/exampleapp/notes
    activate server
    server-->> browser: HTML document sent with new note added!
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
    activate server
    server-->>browser: the css file
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.js
    activate server
    server-->>browser: the JavaScript file
    deactivate server

    browser->>server: GET data.json
    activate server
    server-->>browser: Updated list of notes (JSON)
    deactivate server

    Note right of browser: The browser executes the callback function that renders the notes
    
    
