Bloom Rewards Pro

I inspected the uploaded project. The HTML files need cleanup because duplicate/old code
has been mixed into the project.

Before the app can work correctly:
1. Replace duplicated HTML in index.html and register.html.
2. Remove old Firebase compat script tags.
3. Keep only:
   <script type="module" src="script.js"></script>
4. Keep firebase.js as ES module.

This package is the extracted project with this README added.
