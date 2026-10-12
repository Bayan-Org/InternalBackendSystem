# InternalBackendSystem — API Test Cases

## Auth

| Method | Endpoint                          | Tujuan                                                             |
| ------ | --------------------------------- | ------------------------------------------------------------------ |
| GET    | `{{BASE_URL}}/auth/login`         | Memulai proses login pengguna.                                     |
| GET    | `{{BASE_URL}}/auth/logout`        | Melakukan logout pengguna.                                         |
| GET    | `{{BASE_URL}}/auth/good-bye`      | Menampilkan pesan perpisahan.                                      |
| GET    | `{{BASE_URL}}/auth/verify-token`  | Memverifikasi validitas token pengguna.                            |
| GET    | `{{BASE_URL}}/auth/callback`      | Menangani callback dari proses autentikasi.                        |
| GET    | `{{BASE_URL}}/auth/exchange`      | Melakukan pertukaran kode atau kredensial sesuai alur autentikasi. |
| POST   | `{{BASE_URL}}/auth/refresh-token` | Memperbarui access token menggunakan refresh token.                |

## User

| Method | Endpoint                    | Tujuan                                                                 |
| ------ | --------------------------- | ---------------------------------------------------------------------- |
| GET    | `{{BASE_URL}}/user/pair`    | Mendapatkan profil pengguna yang cocok berdasarkan kriteria pencarian. |
| GET    | `{{BASE_URL}}/user/profile` | Mendapatkan profil pengguna.                                           |

## Task

| Method | Endpoint                       | Tujuan                                                                        |
| ------ | ------------------------------ | ----------------------------------------------------------------------------- |
| GET    | `{{BASE_URL}}/task/data`       | Mendapatkan data task berdasarkan parameter filter.                           |
| GET    | `{{BASE_URL}}/task/collection` | Mendapatkan kumpulan data task.                                               |
| GET    | `{{BASE_URL}}/task/reference`  | Mendapatkan data referensi task berdasarkan parameter detail.                 |
| GET    | `{{BASE_URL}}/task/init`       | Mendapatkan data inisialisasi yang diperlukan untuk proses task (Total Task). |
| POST   | `{{BASE_URL}}/task/approve`    | Menyetujui task atau dokumen approval.                                        |
| POST   | `{{BASE_URL}}/task/reject`     | Menolak task atau dokumen approval.                                           |
| POST   | `{{BASE_URL}}/task/rework`     | Mengembalikan task atau dokumen untuk diperbaiki.                             |
