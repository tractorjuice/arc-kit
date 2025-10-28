import os
import re

def convert_claude_to_gemini():
    claude_dir = '.claude/commands/'
    gemini_dir = '.gemini/commands/arckit'

    if not os.path.exists(gemini_dir):
        os.makedirs(gemini_dir)

    for filename in os.listdir(claude_dir):
        if filename.endswith('.md'):
            claude_path = os.path.join(claude_dir, filename)
            
            with open(claude_path, 'r') as f:
                content = f.read()

            # Extract frontmatter and prompt
            description = ''
            prompt = content
            if content.startswith('---'):
                parts = content.split('---', 2)
                if len(parts) > 1:
                    frontmatter = parts[1]
                    prompt = parts[2].strip()
                    desc_match = re.search(r'description:\s*(.*)', frontmatter)
                    if desc_match:
                        description = desc_match.group(1).strip()

            # Prepare TOML content
            # The prompt needs to be enclosed in triple quotes and properly escaped.
            prompt_formatted = '"""\n' + prompt.replace('\\', '\\\\').replace('"', '\\"') + '\n"""'
            
            # Replace $ARGUMENTS with {{args}}
            prompt_formatted = prompt_formatted.replace('$ARGUMENTS', '{{args}}')

            toml_content = f'description = "{description}"\nprompt = {prompt_formatted}\n'

            # Create new filename
            new_filename = filename.replace('arckit.', '').replace('.md', '.toml')
            gemini_path = os.path.join(gemini_dir, new_filename)

            with open(gemini_path, 'w') as f:
                f.write(toml_content)
            print(f"Converted {claude_path} to {gemini_path}")

if __name__ == '__main__':
    convert_claude_to_gemini()
