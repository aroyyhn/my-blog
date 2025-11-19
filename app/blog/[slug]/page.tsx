import { getSinglePost } from '@/lib/contentful';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import type { Document } from '@contentful/rich-text-types';
import { format, isValid } from 'date-fns';
import { id } from 'date-fns/locale';

export const fetchCache = "force-no-store";
export const revalidate = 0;

// Tipe props untuk App Router
interface PostPageProps {
  params: {
    slug: string;
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = params;

  // Fetch data post
  const post = await getSinglePost(slug);

  // Jika post tidak ditemukan → tampil 404
  if (!post) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center">
        <h1 className="text-2xl font-bold">404</h1>
        <p className="text-gray-600">Postingan dengan slug "{slug}" tidak ditemukan.</p>
      </div>
    );
  }

  const { title, genre, date, content } = post.fields;

  // Pemformatan tanggal aman
  let formattedDate = "Tanggal tidak tersedia";

  if (date) {
    const dateObj = new Date(date as string);
    if (isValid(dateObj)) {
      formattedDate = format(dateObj, 'dd MMMM yyyy', { locale: id });
    } else {
      formattedDate = "Tanggal tidak valid";
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 md:px-0">
      
      {/* Metadata post */}
      {genre && (
        <p className="text-sm text-pink-600 font-medium mb-1 uppercase tracking-wider">
          {Array.isArray(genre) ? genre.join(", ") : String(genre)}
        </p>
      )}

      <h1 className="text-4xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
        {title}
      </h1>

      <p className="text-base text-gray-500 mb-10 border-b pb-4">
        Dipublikasikan pada {formattedDate}
      </p>

      {/* Konten Rich Text */}
      <div className="prose prose-md max-w-none text-gray-700">
        {content
          ? documentToReactComponents(content as Document)
          : <p>Konten belum tersedia.</p>}
      </div>

      {/* Tombol kembali ke blog */}
      <div className="mt-12">
       <a
        href="/blog"
        className="inline-block text-pink-600 hover:text-pink-800 transition font-semibold mt-4"
      >
        ← Kembali ke Daftar Blog
      </a>
      </div>
    </div>
  );
}
