(function($, $$) {
  'use strict';

  (function init() {
    var videos = $$('video');
    [].forEach.call(videos, function(video) {
      if (video.readyState !== 4) {
        video.addEventListener('loadedmetadata', function() {
          return parseVideoSource(video);
        });
      } else {
        return parseVideoSource(video);
      }
    });
  })();

  function parseVideoSource(video) {
    var source = video.currentSrc;
    var hash = source.substring(source.indexOf('#') + 1).split('&');
    var parameters = {};
    hash.map(function(keyValue) {
      var key = keyValue.split('=')[0];
      var value = keyValue.split('=')[1];
      parameters[key] = value;
    });

    var start = parameters.t.split(',')[0];
    var end = parameters.t.split(',')[1];

    var xywh = parameters.xywh.split(',');
    var spatialFragments = [];
    if (xywh.length % 4 === 0) {
      for (var i = 0, lenI = xywh.length; i < lenI; i += 4) {
        var spatialFragment = {
          x: xywh[i],
          y: xywh[i + 1],
          w: xywh[i + 2],
          h: xywh[i + 3]
        };
        spatialFragments.push(spatialFragment);
      }
    }
    return createStyles(video, start, end, spatialFragments);
  }

  function createStyles(video, start, end, spatialFragments) {
    var fragmentDuration = end - start;
    var steps = spatialFragments.length;
    var stepDuration = fragmentDuration / steps;
    var style = document.createElement('style');
    var id = video.id || 'video_' + (Math.random()).toString().substr(2);
    video.id = id;
    style.textContent = 'div.' + id + ' {\n' +
          '  transition-duration:' + stepDuration + 's;\n' +
        '}\n' +
        'div.' + id + '_no-transition {\n' +
          '  transition:none !important;\n' +
        '}\n';
    var classes = [];
    spatialFragments.forEach(function(spatialFragment, i) {
      var className = 'div.' + id + '_xywh_' + i;
      style.textContent += className + ' {\n' +
            '  border:solid 3px yellow;\n' +
            '  display: block !important;\n' +
            '  position:absolute;\n' +
            '  left:' + (video.offsetLeft + parseInt(spatialFragment.x, 10)) +
                'px;\n' +
            '  top:' + (video.offsetTop + parseInt(spatialFragment.y, 10)) +
                'px;\n' +
            '  width:' + spatialFragment.w + 'px;\n' +
            '  height:' + spatialFragment.h + 'px;\n' +
          '}\n';
      classes[i] = id + '_xywh_' + i;
    });
    document.head.appendChild(style);
    return createHighlightDiv(video, start, steps, stepDuration, classes);
  }

  function createHighlightDiv(video, start, steps, stepDuration, classes) {
    var div = document.createElement('div');
    div.innerHTML = '&nbsp;';
    div.style.display = 'none';
    div.classList.add(video.id);
    document.body.appendChild(div);
    return addTimeupdateListener(video, start, steps, stepDuration, classes,
        div);
  }

  function addTimeupdateListener(video, start, steps, stepDuration, classes,
      div) {
    video.addEventListener('timeupdate', function() {
      var currentTime = video.currentTime;
      classes.forEach(function(className) {
        div.classList.remove(className);
      });
      for (var i = 0; i < steps; i++) {
        if ((start + i * stepDuration <= currentTime) &&
            (currentTime <= start + (i + 1) * stepDuration)) {
          for (var j = 0; j < i; j++) {
            div.classList.remove(classes[j]);
          }
          div.classList.add(classes[i]);
          for (var k = i + 1; k < steps; k++) {
            div.classList.remove(classes[k]);
          }
        }
      }
    });
    return addPauseListener(video, div);
  }

  function addPauseListener(video, div) {
    var currentStyle = {};
    var frozenStyle = {};
    video.addEventListener('pause', function() {
      console.log('pause');
      div.classList.remove(video.id + '_no-transition');
      for (var property in div.style) {
        currentStyle[property] = div.style[property];
      }
      frozenStyle = getComputedStyle(div);
      for (var i = 0, lenI = frozenStyle.length; i < lenI; i++) {
        var property = frozenStyle[i];
        console.log(property);
        div.style[property] = frozenStyle[property];
      }
    });
    return addPlayListener(video, div, currentStyle, frozenStyle);
  }

  function addPlayListener(video, div, currentStyle, frozenStyle) {
    video.addEventListener('play', function() {
      console.log('play');
      div.classList.remove(video.id + '_no-transition');
      for (var i = 0, lenI = frozenStyle.length; i < lenI; i++) {
        var property = frozenStyle[i];
        if (!currentStyle[property]) {
          div.style.removeProperty(property);
        }
      }
      console.log(currentStyle);
      for (var property in currentStyle) {
        console.log(property);
        div.style[property] = currentStyle[property];
      }
    });
    return addSeekedListener(video, div, currentStyle);
  }

  function addSeekedListener(video, div, currentStyle) {
    video.addEventListener('seeked', function() {
      console.log('seeked');
      var frozenStyle = getComputedStyle(video);
      for (var i = 0, lenI = frozenStyle.length; i < lenI; i++) {
        var property = frozenStyle[i];
        console.log(property);
        if (!currentStyle[property]) {
          div.style.removeProperty(property);
        }
      }
      console.log(currentStyle);
      for (var property in currentStyle) {
        console.log(property);
        div.style[property] = currentStyle[property];
      }
      div.classList.add(video.id + '_no-transition');
      div.classList.remove(video.id + '_no-transition');
    });
  }

})(document.querySelector.bind(document),
    document.querySelectorAll.bind(document));
