/* ============================================================
   catalogo.js — Catálogo central de productos AkibaraXpress
   ============================================================ */

const CATALOGO = [
    /* ── Figuras: Dragon Ball ── */
    { id: 'shf-goku-daima',    nuevo: true,  stock: 'preventa',  categoria: 'Figuras', serie: 'Dragon Ball',      vendedor: 'Bandai',      precio: 1299, nombre: 'S.H.Figuarts Son Goku -DAIMA-',              imagen: 'Imagenes/Imagenes Productos/SH FIGUAFRTS SON GOKU -DAIMA-.webp' },
    { id: 'shf-vegeta-daima',  nuevo: true,  stock: 'preventa',  categoria: 'Figuras', serie: 'Dragon Ball',      vendedor: 'Bandai',      precio: 1299, nombre: 'S.H.Figuarts Vegeta -DAIMA-',                imagen: 'Imagenes/Imagenes Productos/SH FIGUARTS VEGETA -DAIMA-.webp' },
    { id: 'shf-piccolo-daima', nuevo: true,  stock: 'preventa',  categoria: 'Figuras', serie: 'Dragon Ball',      vendedor: 'Bandai',      precio: 1199, nombre: 'S.H.Figuarts Piccolo -DAIMA-',               imagen: 'Imagenes/Imagenes Productos/S.H FIGUARTS PICCOLO -DAIMA-.webp' },
    { id: 'shf-piccolo-hero',  nuevo: false, stock: 'agotado',   categoria: 'Figuras', serie: 'Dragon Ball',      vendedor: 'Bandai',      precio: 1399, nombre: 'S.H.Figuarts Piccolo Super Hero',             imagen: 'Imagenes/Imagenes Productos/SH Figuarts Piccolo Super Hero -Dragon Ball Super.webp' },
    { id: 'shf-frieza',        nuevo: false, stock: 'en-stock',  categoria: 'Figuras', serie: 'Dragon Ball',      vendedor: 'Bandai',      precio: 1199, nombre: 'S.H.Figuarts Frieza Fourth Form',             imagen: 'Imagenes/Imagenes Productos/SH FIGUARTS FRIEZA FOURTH FORM (REISSUE).webp' },
    { id: 'shf-cell',          nuevo: false, stock: 'en-stock',  categoria: 'Figuras', serie: 'Dragon Ball',      vendedor: 'Bandai',      precio: 1199, nombre: 'S.H.Figuarts Cell First Form',                imagen: 'Imagenes/Imagenes Productos/SH FIGUARTS CELL FIRST FORM (REISSUE).webp' },
    { id: 'shf-ss4-goku',      nuevo: true,  stock: 'en-stock',  categoria: 'Figuras', serie: 'Dragon Ball',      vendedor: 'Bandai',      precio: 999,  nombre: 'S.H.Figuarts SS4 Son Goku (Mini) DAIMA',     imagen: 'Imagenes/Imagenes Productos/SH FIGUARTS SUPER SAIYAN 4 SON GOKU (MINI) DAIMA.webp' },
    { id: 'shf-goku-20',       nuevo: false, stock: 'en-stock',  categoria: 'Figuras', serie: 'Dragon Ball',      vendedor: 'Bandai',      precio: 1099, nombre: 'S.H.Figuarts Goku 2.0',                      imagen: 'Imagenes/Imagenes Productos/SH Figuarts Goku 2.0.webp' },

    /* ── Figuras: Demon Slayer ── */
    { id: 'pup-sanemi',        nuevo: false, stock: 'en-stock',  categoria: 'Figuras', serie: 'Demon Slayer',     vendedor: 'Good Smile',  precio: 699,  nombre: 'Pop Up Parade Sanemi Shinazugawa',            imagen: 'Imagenes/Imagenes Productos/POP UP PARADE SANEMI SHINAZUGAWA.webp' },
    { id: 'pup-tengen',        nuevo: false, stock: 'en-stock',  categoria: 'Figuras', serie: 'Demon Slayer',     vendedor: 'Good Smile',  precio: 699,  nombre: 'Pop Up Parade Tengen Uzui',                   imagen: 'Imagenes/Imagenes Productos/POP UP PARADE TENGEN UZUI.webp' },
    { id: 'pup-mitsuri',       nuevo: true,  stock: 'en-stock',  categoria: 'Figuras', serie: 'Demon Slayer',     vendedor: 'Good Smile',  precio: 699,  nombre: 'Pop Up Parade Mitsuri Kanroji',               imagen: 'Imagenes/Imagenes Productos/POP UP PARADE Mitsuri Kanroji.webp' },
    { id: 'pup-inosuke',       nuevo: false, stock: 'en-stock',  categoria: 'Figuras', serie: 'Demon Slayer',     vendedor: 'Good Smile',  precio: 699,  nombre: 'Pop Up Parade Inosuke Hashibira',             imagen: 'Imagenes/Imagenes Productos/Good Smile Company POP UP PARADE Inosuke Hashibira.webp' },
    { id: 'figma-akaza',       nuevo: false, stock: 'agotado',   categoria: 'Figuras', serie: 'Demon Slayer',     vendedor: 'Max Factory', precio: 1599, nombre: 'Figma Akaza',                                  imagen: 'Imagenes/Imagenes Productos/Figma Akaza.webp' },

    /* ── Figuras: My Hero Academia ── */
    { id: 'shf-dabi',          nuevo: true,  stock: 'en-stock',  categoria: 'Figuras', serie: 'My Hero Academia', vendedor: 'Bandai',      precio: 1249, nombre: 'S.H.Figuarts Dabi',                           imagen: 'Imagenes/Imagenes Productos/SH FIGUARTS DABI.webp' },

    /* ── Mangas: Demon Slayer ── */
    { id: 'ds-7',              nuevo: false, stock: 'en-stock',  categoria: 'Mangas',  serie: 'Demon Slayer',     vendedor: 'Panini',      precio: 189,  nombre: 'Demon Slayer Vol. 7',                          imagen: 'Imagenes/Imagenes Productos/DEMON SLAYER N.7.webp' },
    { id: 'ds-10',             nuevo: false, stock: 'en-stock',  categoria: 'Mangas',  serie: 'Demon Slayer',     vendedor: 'Panini',      precio: 189,  nombre: 'Demon Slayer Vol. 10',                         imagen: 'Imagenes/Imagenes Productos/DEMON SLAYER N.10.webp' },
    { id: 'ds-14',             nuevo: false, stock: 'agotado',   categoria: 'Mangas',  serie: 'Demon Slayer',     vendedor: 'Panini',      precio: 189,  nombre: 'Demon Slayer Vol. 14',                         imagen: 'Imagenes/Imagenes Productos/DEMON SLAYER N.14.webp' },
    { id: 'ds-15',             nuevo: true,  stock: 'en-stock',  categoria: 'Mangas',  serie: 'Demon Slayer',     vendedor: 'Panini',      precio: 189,  nombre: 'Demon Slayer Vol. 15',                         imagen: 'Imagenes/Imagenes Productos/DEMON SLAYER N.15.webp' },

    /* ── Mangas: One Piece ── */
    { id: 'op-3',              nuevo: false, stock: 'en-stock',  categoria: 'Mangas',  serie: 'One Piece',        vendedor: 'Panini',      precio: 189,  nombre: 'One Piece Vol. 3',                             imagen: 'Imagenes/Imagenes Productos/ONE PIECE N.3.webp' },
    { id: 'op-22',             nuevo: false, stock: 'agotado',   categoria: 'Mangas',  serie: 'One Piece',        vendedor: 'Panini',      precio: 189,  nombre: 'One Piece Vol. 22',                            imagen: 'Imagenes/Imagenes Productos/ONE PIECE N.22.webp' },
    { id: 'op-50',             nuevo: false, stock: 'en-stock',  categoria: 'Mangas',  serie: 'One Piece',        vendedor: 'Panini',      precio: 189,  nombre: 'One Piece Vol. 50',                            imagen: 'Imagenes/Imagenes Productos/ONE PIECE N.50.webp' },
    { id: 'op-52',             nuevo: false, stock: 'en-stock',  categoria: 'Mangas',  serie: 'One Piece',        vendedor: 'Panini',      precio: 189,  nombre: 'One Piece Vol. 52',                            imagen: 'Imagenes/Imagenes Productos/ONE PIECE N.52.webp' },
    { id: 'op-54',             nuevo: false, stock: 'en-stock',  categoria: 'Mangas',  serie: 'One Piece',        vendedor: 'Panini',      precio: 189,  nombre: 'One Piece Vol. 54',                            imagen: 'Imagenes/Imagenes Productos/ONE PIECE N.54.webp' },
    { id: 'op-57',             nuevo: true,  stock: 'en-stock',  categoria: 'Mangas',  serie: 'One Piece',        vendedor: 'Panini',      precio: 189,  nombre: 'One Piece Vol. 57',                            imagen: 'Imagenes/Imagenes Productos/ONE PIECE N.57.webp' },
    { id: 'op-3en1-2',         nuevo: false, stock: 'en-stock',  categoria: 'Mangas',  serie: 'One Piece',        vendedor: 'Panini',      precio: 299,  nombre: 'One Piece (3 en 1) Vol. 2',                   imagen: 'Imagenes/Imagenes Productos/ONE PIECE (3 EN 1) N.2.webp' },
    { id: 'op-allfaces3',      nuevo: true,  stock: 'preventa',  categoria: 'Mangas',  serie: 'One Piece',        vendedor: 'Panini',      precio: 349,  nombre: 'One Piece All Faces 3',                        imagen: 'Imagenes/Imagenes Productos/ONE PIECE ALL FACES 3.webp' },
    { id: 'db-artbook',        nuevo: false, stock: 'agotado',   categoria: 'Mangas',  serie: 'Dragon Ball',      vendedor: 'Shueisha',    precio: 899,  nombre: 'Artbook Dragon Ball Z Daizenshuu 2',           imagen: 'Imagenes/Imagenes Productos/Artbook Dragon Ball Z daizenshuu 2 ARTBOOK JAPONES.webp' },

    /* ── TCG: One Piece ── */
    { id: 'op-micas-robin',    nuevo: false, stock: 'en-stock',  categoria: 'TCG',     serie: 'One Piece',        vendedor: 'Bandai',      precio: 299,  nombre: 'One Piece TCG Micas Nico Robin',               imagen: 'Imagenes/Imagenes Productos/ONE PIECE TCG MICAS NICO ROBIN.webp' },
    { id: 'op-micas-bonney',   nuevo: true,  stock: 'preventa',  categoria: 'TCG',     serie: 'One Piece',        vendedor: 'Bandai',      precio: 299,  nombre: 'One Piece TCG Micas Jewelry Bonney Vol. 5',    imagen: 'Imagenes/Imagenes Productos/ONE PIECE TCG MICAS VOL 5 JEWELRY BONNEY.webp' },

    /* ── TCG: World Cup 2026 ── */
    { id: 'wc26-sobre',        nuevo: true,  stock: 'preventa',  categoria: 'TCG',     serie: 'World Cup 26',     vendedor: 'Panini',      precio: 59,   nombre: 'World Cup 2026 Sobre Individual Adrenalyn XL', imagen: 'Imagenes/Imagenes Productos/WORLD CUP 2026 SOBRE INDIVIDUAL.webp' },
    { id: 'wc26-blaster',      nuevo: true,  stock: 'preventa',  categoria: 'TCG',     serie: 'World Cup 26',     vendedor: 'Panini',      precio: 599,  nombre: 'World Cup 2026 Blaster Box Adrenalyn XL',      imagen: 'Imagenes/Imagenes Productos/WORLD CUP 2026 TCG BLASTER BOX (8 Packets + 2 LE Cards) ADRENALYN XL.webp' },
    { id: 'wc26-dream',        nuevo: true,  stock: 'preventa',  categoria: 'TCG',     serie: 'World Cup 26',     vendedor: 'Panini',      precio: 1199, nombre: 'World Cup 2026 Dream Box Adrenalyn XL',        imagen: 'Imagenes/Imagenes Productos/WORLD CUP 2026 TCG DREAM BOX (50 CARDS) ADRENALYN XL.webp' },
    { id: 'wc26-premium',      nuevo: true,  stock: 'preventa',  categoria: 'TCG',     serie: 'World Cup 26',     vendedor: 'Panini',      precio: 149,  nombre: 'Sobre Premium 10 Tarjetas World Cup 2026',     imagen: 'Imagenes/Imagenes Productos/1 SOBRE PREMIUM CON 10 TARJETAS WORLD CUP 2026 ADRENALYN XL.webp' },
];
