/* Browser build: replaces the Linux i_system.c. Time comes from the page clock. */
#include <stdarg.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "doomdef.h"
#include "m_misc.h"
#include "i_video.h"
#include "i_sound.h"
#include "d_net.h"
#include "g_game.h"
#include "i_system.h"
#include <emscripten.h> /* after the Doom headers: it defines true/false macros */

int mb_used = 16;

void I_Tactile(int on, int off, int total) {}

ticcmd_t emptycmd;
ticcmd_t *I_BaseTiccmd(void) { return &emptycmd; }

int I_GetHeapSize(void) { return mb_used * 1024 * 1024; }

byte *I_ZoneBase(int *size)
{
    *size = mb_used * 1024 * 1024;
    return (byte *)malloc(*size);
}

/* time in 1/35th second tics */
int I_GetTime(void)
{
    return (int)(emscripten_get_now() * TICRATE / 1000.0);
}

void I_Init(void)
{
    I_InitSound();
    I_InitMusic();
}

EM_JS(void, js_doom_exit, (int code), {
    if (Module.onDoomExit) Module.onDoomExit(code);
});

void I_Quit(void)
{
    D_QuitNetGame();
    I_ShutdownSound();
    I_ShutdownMusic();
    M_SaveDefaults();
    I_ShutdownGraphics();
    js_doom_exit(0);
    exit(0);
}

void I_WaitVBL(int count)
{
    emscripten_sleep(count * 1000 / 70);
}

void I_BeginRead(void) {}
void I_EndRead(void) {}

byte *I_AllocLow(int length)
{
    byte *mem = (byte *)malloc(length);
    memset(mem, 0, length);
    return mem;
}

extern boolean demorecording;

EM_JS(void, js_doom_error, (const char *msg), {
    if (Module.onDoomError) Module.onDoomError(UTF8ToString(msg));
});

void I_Error(char *error, ...)
{
    va_list argptr;
    static char msg[512];
    static int in_error = 0;

    va_start(argptr, error);
    vsnprintf(msg, sizeof(msg), error, argptr);
    va_end(argptr);
    fprintf(stderr, "Error: %s\n", msg);

    if (in_error) exit(-1);
    in_error = 1;
    js_doom_error(msg);

    D_QuitNetGame();
    I_ShutdownGraphics();
    exit(-1);
}
