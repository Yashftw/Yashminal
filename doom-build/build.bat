@echo off
rem Compiles the original linuxdoom 1.10 source (src\) plus the browser platform layer (glue\) to WebAssembly.
rem Requires the Emscripten SDK at E:\emsdk.
call E:\emsdk\emsdk_env.bat >nul 2>&1
set HERE=%~dp0
set FILES=
for %%f in ("%HERE%src\*.c") do call set FILES=%%FILES%% "%%f"
for %%f in ("%HERE%glue\*.c") do call set FILES=%%FILES%% "%%f"
call emcc %FILES% -O2 -std=gnu89 -w -DNORMALUNIX -I"%HERE%shim" -I"%HERE%src" -sASYNCIFY -sINITIAL_MEMORY=67108864 -sALLOW_MEMORY_GROWTH=1 -sEXPORTED_FUNCTIONS=_main,_doom_key -sEXPORTED_RUNTIME_METHODS=ccall,cwrap --preload-file "%HERE%wad\doom1.wad@/doom1.wad" -o "%HERE%..\public\doom\doom.js"
