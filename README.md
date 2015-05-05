# Dynamic Media Fragments

I'm currently exploring ideas around *dynamic* spatial media fragments and
their representation in [Media Fragments URI](http://www.w3.org/TR/media-frags/)
for highlighting moving targets in Web video.

I have had a first stab at *dynamic* spatial media fragments and managed to hack
together a [live demo](http://tomayac.github.io/dynamic-media-fragments/).
Let it load and play the video, after roughly 10s you should see
something (watch the upper left corner and look at the yellow
highlight ```div```). The [video's URL](http://tomayac.github.io/dynamic-media-fragments/videos/big_buck_bunny.mp4#t=0,50&xywh=0,0,10,10,20,50,120,150,120,40,180,90,200,200,100,100,300,100,90,200)
contains a temporal media fragment ```t=0,50``` and a *dynamic* spatial media
fragment ```xywh=0,0,10,10,20,50,120,150,120,40,180,90,200,200,100,100,300,100,90,200```
(note, this is my freestyle extension of the current [xywh spatial dimension](http://www.w3.org/TR/media-frags/#naming-space) naming standard).

As you can see, a comma-separated list of quadruples
marks the moving ```xywh```'s "keyframes". The browser takes care of the
smooth interpolations from keyframe to keyframe via auto-generated
[CSS transitions](https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Using_CSS_transitions).
Be sure to inspect
the DOM tree and look at the auto-generated ```style``` element and watch
the classes dynamically change on the highlight ```div```. Freezing and
unfreezing the state works perfectly fine (play→pause→play), but there
are still some issues with seeking. I'm trying to fix those in the
next couple of days. Looking forward to any feedback you may have.
