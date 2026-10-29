/* Browser build: sound effects are played through Web Audio; music is a stub. */
#include <stdio.h>

#include "z_zone.h"
#include "m_swap.h"
#include "i_system.h"
#include "i_sound.h"
#include "w_wad.h"
#include "doomdef.h"
#include <emscripten.h> /* after the Doom headers: it defines true/false macros */

EM_JS(void, js_play_sfx, (const unsigned char *ptr, int count, int rate, int vol, int sep), {
    if (!Module.doomAudio) {
        var AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        Module.doomAudio = new AC();
    }
    var ac = Module.doomAudio;
    if (ac.state === 'suspended') ac.resume();
    if (Module.doomMuted) return;
    var buf = ac.createBuffer(1, count, rate);
    var ch = buf.getChannelData(0);
    for (var i = 0; i < count; i++) ch[i] = (HEAPU8[ptr + i] - 128) / 128;
    var src = ac.createBufferSource();
    src.buffer = buf;
    var g = ac.createGain();
    g.gain.value = (vol / 127) * 0.8;
    var node = g;
    src.connect(g);
    if (ac.createStereoPanner) {
        var p = ac.createStereoPanner();
        p.pan.value = Math.max(-1, Math.min(1, (sep - 128) / 128));
        g.connect(p);
        node = p;
    }
    node.connect(ac.destination);
    src.start();
});

void I_SetChannels(void) {}

int I_GetSfxLumpNum(sfxinfo_t *sfx)
{
    char namebuf[9];
    sprintf(namebuf, "ds%s", sfx->name);
    return W_GetNumForName(namebuf);
}

int I_StartSound(int id, int vol, int sep, int pitch, int priority)
{
    static int handle = 0;
    sfxinfo_t *sfx = &S_sfx[id];
    unsigned char *d;
    int rate, n;

    if (sfx->lumpnum < 0) sfx->lumpnum = I_GetSfxLumpNum(sfx);
    d = (unsigned char *)W_CacheLumpNum(sfx->lumpnum, PU_CACHE);

    /* lump = 8-byte header, then 16 pad bytes, samples, 16 pad bytes */
    rate = d[2] | (d[3] << 8);
    n = d[4] | (d[5] << 8) | (d[6] << 16) | (d[7] << 24);
    if (n > 32 && rate > 0) js_play_sfx(d + 8 + 16, n - 32, rate, vol, sep);

    return ++handle;
}

void I_StopSound(int handle) {}
int I_SoundIsPlaying(int handle) { return 0; }
void I_UpdateSoundParams(int handle, int vol, int sep, int pitch) {}

void I_InitSound(void) {}
void I_UpdateSound(void) {}
void I_SubmitSound(void) {}
void I_ShutdownSound(void) {}

void I_InitMusic(void) {}
void I_ShutdownMusic(void) {}
void I_SetMusicVolume(int volume) {}
void I_PauseSong(int handle) {}
void I_ResumeSong(int handle) {}
int I_RegisterSong(void *data) { return 1; }
void I_PlaySong(int handle, int looping) {}
void I_StopSong(int handle) {}
void I_UnRegisterSong(int handle) {}

/* referenced by the config table in m_misc.c; unused in the browser */
char *sndserver_filename = "sndserver";
