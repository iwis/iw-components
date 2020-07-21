tippy('[data-tippy-content]', {
  // sets data-theme="light-border" attribute on the tippy element (see below); built-in themes: 'light', 'light-border', 'material', 'translucent'; def. ''
  theme: 'light-border',

  // [show, hide] - delay in ms once a trigger event is fired before a tippy shows or hides; def. [0, 0]
  delay: [600, 0],

  // parse content strings as HTML; def. false; make sure you are sanitizing any user data if rendering HTML to prevent XSS attacks
  allowHTML: true,

  // tippy has interactive content inside of it, so that it can be hovered over and clicked inside without hiding; def. false,
  // interactive: true,

  // maximum width of the tippy; def. 350px
  // maxWidth: 350,

  // positions the tippy relative to its reference element; possible values: '{top|bottom|left|right}[-{start|end}]'; def. 'top'
  // placement: 'top',

  // def. 'describedby'; see: https://github.com/atomiks/tippyjs/blob/master/MIGRATION_GUIDE.md , https://atomiks.github.io/tippyjs/v6/all-props/#aria
  // aria: 'labelledby',

  // [show, hide] - duration of the CSS transition animation in ms; def. [300, 250]
  // duration: [300, 250],

  // don't display arrow
  // arrow: false,

  // how far in pixels the tippy element is from the reference element; def. [0, 10]
  // offset: [0, distance],

  // for debugging: turns tippy on permanently after clicking
  // hideOnClick: false,
  // trigger: 'click',
})

/*
The basic structure of a tippy element [with custom theme]:
  <button data-tippy-content="Tooltip content" [aria-describedby="tippy-1"]>Button with tooltip</button>

 [<div data-tippy-root id="tippy-1">
    <div class="tippy-box" data-state="visible" [data-theme="light-border"] role="tooltip" data-placement="top">
      <div class="tippy-content" data-state="visible">Tooltip content</div>
      <div class="tippy-arrow"></div>                                <!-- if "arrow: true" -->
    </div>
  </div>]
*/
