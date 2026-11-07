(() => {
  const track = document.getElementById('works');
  const canvas = track.querySelector('.folio-character canvas');
  const gl = canvas.getContext('webgl', {alpha:true, premultipliedAlpha:true});
  if (!gl) return;

  function shader(type, source) {
    const result = gl.createShader(type);
    gl.shaderSource(result, source);
    gl.compileShader(result);
    if (!gl.getShaderParameter(result, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(result));
    return result;
  }
  const program = gl.createProgram();
  gl.attachShader(program, shader(gl.VERTEX_SHADER, `
    attribute vec2 point; varying vec2 uv;
    void main() {uv=vec2((point.x+1.)*.5,(1.-point.y)*.5);gl_Position=vec4(point,0.,1.);}
  `));
  gl.attachShader(program, shader(gl.FRAGMENT_SHADER, `
    precision mediump float;
    varying vec2 uv; uniform sampler2D frame;
    void main() {
      vec3 c=texture2D(frame,uv).rgb;
      float green=c.g-max(c.r,c.b);
      // Compressed and motion-blurred fingers contain weaker green than the screen.
      float alpha=1.-smoothstep(.025,.16,green);
      float spill=smoothstep(0.,.10,green);
      float neutralGreen=(c.r+c.b)*.5;
      c.g=mix(c.g,min(c.g,neutralGreen),spill);
      gl_FragColor=vec4(c*alpha,alpha);
    }
  `));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
  gl.useProgram(program);
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
  gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
  const point = gl.getAttribLocation(program,'point');
  gl.enableVertexAttribArray(point);
  gl.vertexAttribPointer(point,2,gl.FLOAT,false,0,0);
  gl.bindTexture(gl.TEXTURE_2D,gl.createTexture());
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
  gl.uniform1i(gl.getUniformLocation(program,'frame'),0);
  canvas.width=1280;
  canvas.height=720;
  gl.viewport(0,0,canvas.width,canvas.height);

  const video = document.createElement('video');
  video.muted=true;
  video.playsInline=true;
  video.preload='auto';
  video.src=window.PORTFOLIO_WORKS_VIDEO || 'assets/works-character.mp4';
  let visible=false;
  let started=false;
  let animation=0;
  const calm=matchMedia('(prefers-reduced-motion:reduce)');
  function paint() {
    if (video.readyState<2) return;
    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,video);
    gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
  }
  function draw() {
    paint();
    if (!video.paused) animation=requestAnimationFrame(draw);
  }
  function sync() {
    const landed=track.classList.contains('is-landed') || !track.classList.contains('has-ribbon');
    cancelAnimationFrame(animation);
    if (!visible || !landed) {
      video.pause();
      started=false;
      return;
    }
    if (document.hidden) {video.pause();return;}
    if (!started) {
      started=true;
      video.currentTime=calm.matches && Number.isFinite(video.duration) ? Math.max(0,video.duration-.08) : 0;
    }
    if (calm.matches || video.ended) return;
    video.play().then(() => {
      if (!visible || document.hidden) {video.pause();return;}
      cancelAnimationFrame(animation);
      draw();
    }).catch(() => {});
  }
  video.addEventListener('seeked',paint);
  video.addEventListener('loadeddata',sync);
  video.addEventListener('ended',paint);
  new MutationObserver(sync).observe(track,{attributes:true,attributeFilter:['class']});
  new IntersectionObserver(([entry]) => {visible=entry.isIntersecting;sync();}).observe(track);
  document.addEventListener('visibilitychange',sync);
})();
