function DeviceMeta() {
  let gl;
  if (!gl) {
    try {
      let canvas = document.createElement("canvas");
      gl =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    } catch (e) {}
  }
  let hints = {};
  if (navigator.userAgentData) {
    const fetchHints = [
      "brands",
      "mobile",
      "platform",
      "platformVersion",
      "architecture",
      "bitness",
      "wow64",
      "model",
      "uaFullVersion",
      "fullVersionList",
    ];

    navigator.userAgentData.getHighEntropyValues(fetchHints).then((result) => {
      hints = JSON.parse(JSON.stringify(result));
    });
  }

  /** #################################
   *  private helper methods
   * ################################# */

  /**
   * get gpu name
   * @returns {string|null}
   */
  function getGPUName() {
    return gl
      ? gl.getParameter(
          gl.getExtension("WEBGL_debug_renderer_info").UNMASKED_RENDERER_WEBGL
        )
      : null;
  }

  /**
   * get device pixel ratio
   */
  function getRatio() {
    return window.devicePixelRatio;
  }

  /**
   * get device width of the screen in pixels
   */
  function getWidth() {
    return window.screen.width * getRatio();
  }

  /**
   * get device height of the screen in pixels
   */
  function getHeight() {
    return window.screen.height * getRatio();
  }
  /**
   * get check is ua apply
   * @return {boolean}
   */
  function isAppleFamily() {
    return /iPhone|iPad|Macintosh|Ipod/.exec(navigator.userAgent) !== null;
  }

  /**
   * get timer stamp
   * @return {DOMHighResTimeStamp|number}
   */
  function performance() {
    return new Date().getTime();
  }

  /**
   * get device memory
   * @return {number|null}
   */
  function getDeviceMemory() {
    return navigator.deviceMemory ? navigator.deviceMemory : null;
  }

  /**
   * Determines if the query is supported by the device.
   * @param {string} query
   * @returns {boolean}
   */
  function hasMediaSupport(query) {
    return window.matchMedia(query).matches;
  }

  function getMediaValue(name, values) {
    for (let i = 0; i < values.length; i++) {
      if (hasMediaSupport("(" + name + ": " + values[i] + ")")) {
        return values[i];
      }
    }
    return "";
  }

  function getMediaColorGamut() {
    return getMediaValue("color-gamut", ["p3", "srgb"]);
  }

  /** #################################
   *  public methods
   * ################################# */

  this.info = function () {
    return {
      useragent: navigator.userAgent,
      meta: {
        width: getWidth(),
        height: getHeight(),
        ratio: getRatio(),
        ram: getDeviceMemory(),
        gpu: getGPUName(),
        colorDepth: screen.colorDepth,
        gamut: getMediaColorGamut(),
        cores: navigator.hardwareConcurrency || null,
      },
      hints: hints,
    };
  };
}

const data = new DeviceMeta().info()

fetch("/analyze", {
  method: "POST",
  headers: {
    "content-type": "application/json",
  },
  body: JSON.stringify(data),
});
