import CardOpen from "@/components/CardOpen";

export default function MoviePage({ params }: { params: { id: string } }) {
  return <CardOpen movieId={params.id} />;
}
