/* musl has no <values.h>; the original source only wants these limits. */
#ifndef _VALUES_SHIM_H
#define _VALUES_SHIM_H
#include <limits.h>
#ifndef MAXINT
#define MAXCHAR   ((char)0x7f)
#define MAXSHORT  ((short)0x7fff)
#define MAXINT    ((int)0x7fffffff)
#define MAXLONG   ((long)0x7fffffff)
#define MINCHAR   ((char)0x80)
#define MINSHORT  ((short)0x8000)
#define MININT    ((int)0x80000000)
#define MINLONG   ((long)0x80000000)
#endif
#endif
