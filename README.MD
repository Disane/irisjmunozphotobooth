Static usage
------------
- Open `public/html/index.html` directly in your browser (or double-click `index.html` at the repo root, which just redirects there).
- No Node.js is required anymore; all assets live under `public/` and run client-side only.

TODO
----
1. Ask for license information: https://fontzone.net/font-details/ar-bonnie
2. Make the hero banner show up correctly in mobile mode
3. Register FontAwesome services on website owner's email address!

Libraries used
--------------
Frontend: PhotoSwipe - v4.1.3 - 2019-01-08, FontAwesome

NOTES:
- PhotoSwipe requires the `data-size` attribute on each anchor tag (widthxheight) so the modal gallery can size images correctly.
- When updating PhotoSwipe:
  * The paths in `public/style/PhotoSwipe/default-skin.css` point to `public/img/PhotoSwipe`.
  * `initPhotoSwipeFromDOM` skips H1 elements in the gallery markup.
- When resizing the browser window while the nav-bar is open the main title and the subtitles are not rendered.
- styles.css > body - overflow-x is disabled

Licenses:
---------
PhotoSwipe: https://github.com/dimsemenov/PhotoSwipe/blob/master/LICENSE
Font "Wire One": ./Docs/Licenses/OFL.txt
Font "arbonnie": https://fontzone.net/font-details/ar-bonnie
