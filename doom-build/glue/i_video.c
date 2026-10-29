/* Browser build: paints the 8-bit framebuffer onto a <canvas> and turns
 * keyboard events posted from JS into Doom events. */
#include <string.h>

#include "doomstat.h"
#include "i_system.h"
#include "v_video.h"
#include "m_argv.h"
#include "d_main.h"
#include "doomdef.h"
#include "i_video.h"
#include <emscripten.h> /* after the Doom headers: it defines true/false macros */

extern byte gammatable[5][256];

static unsigned int palette32[256];
static unsigned int frame32[SCREENWIDTH * SCREENHEIGHT];

EM_JS(void, js_present, (unsigned int *ptr), {
    var ctx = Module.doomCtx;
    if (!ctx) {
        var cv = Module.canvas;
        ctx = Module.doomCtx = cv.getContext('2d');
        Module.doomImg = ctx.createImageData(320, 200);
    }
    Module.doomImg.data.set(HEAPU8.subarray(ptr, ptr + 320 * 200 * 4));
    ctx.putImageData(Module.doomImg, 0, 0);
});

EMSCRIPTEN_KEEPALIVE
void doom_key(int down, int key)
{
    event_t ev;
    ev.type = down ? ev_keydown : ev_keyup;
    ev.data1 = key;
    D_PostEvent(&ev);
}

void I_ShutdownGraphics(void) {}
void I_StartFrame(void) {}
void I_StartTic(void) {}
void I_UpdateNoBlit(void) {}

void I_InitGraphics(void) {}

void I_FinishUpdate(void)
{
    int i;
    byte *src = screens[0];
    for (i = 0; i < SCREENWIDTH * SCREENHEIGHT; i++)
        frame32[i] = palette32[src[i]];
    js_present(frame32);
    /* hand control back to the browser so it can paint and read input */
    emscripten_sleep(0);
}

void I_ReadScreen(byte *scr)
{
    memcpy(scr, screens[0], SCREENWIDTH * SCREENHEIGHT);
}

void I_SetPalette(byte *palette)
{
    int i;
    for (i = 0; i < 256; i++) {
        unsigned int r = gammatable[usegamma][*palette++];
        unsigned int g = gammatable[usegamma][*palette++];
        unsigned int b = gammatable[usegamma][*palette++];
        palette32[i] = 0xff000000u | (b << 16) | (g << 8) | r;
    }
}
