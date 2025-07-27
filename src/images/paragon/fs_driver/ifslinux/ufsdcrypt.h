/////////////////////////////////////////////////////////////////////////////
//
// Filesystem crypto code for APFS
//
// Copyright (c) 2018-2019 Paragon Software Group, All rights reserved.
//
/////////////////////////////////////////////////////////////////////////////
//
// This file is under the terms of the GNU General Public License, version 2.
// http://www.gnu.org/licenses/gpl-2.0.html
//
//
// UNLESS OTHERWISE AGREED IN A WRITING SIGNED BY THE PARTIES, THIS SOFTWARE IS
// PROVIDED "AS-IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
// LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A
// PARTICULAR PURPOSE, ALL OF WHICH ARE HEREBY DISCLAIMED. IN NO EVENT SHALL THE
// AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF NOT ADVISED OF
// THE POSSIBILITY OF SUCH DAMAGE.
//
///////////////////////////////////////////////////////////////////////////////

#ifndef __UCipher_H
#define __UCipher_H

struct UCipher
{
  struct crypto_cipher    *tfm;
  struct crypto_blkcipher *blk_tfm;
  struct crypto_skcipher  *sk_tfm;
  struct skcipher_request *req;
  struct crypto_shash     *shash;
  struct sdesc            *sdesc;

  void*         key;
  unsigned int  key_len;
};


struct crypt_operations {
  int (*init)(struct UCipher*, const char *cipher_name);
  int (*set_key)(struct UCipher*, const void *key, unsigned int key_len);
  void (*release)(struct UCipher*);
  int (*decrypt)(struct UCipher*, const void *enc_data, unsigned int enc_size, void *iv, void *dec_data, unsigned int *dec_size);
  int (*encrypt)(struct UCipher*, const void *dec_data, unsigned int dec_size, void *iv, void *enc_data, unsigned int *enc_size);

  int (*shash_init)(struct UCipher*);
  int (*shash_update)(struct UCipher*, const void *buf, unsigned int buf_size);
  int (*shash_final)(struct UCipher*, void *outbuf);
};

extern const struct crypt_operations crypt_op;

int parse_pass_file( struct file *f, char **pass_array );
#endif
